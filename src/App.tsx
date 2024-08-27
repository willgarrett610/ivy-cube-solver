/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';

import { OrbitControls } from '@react-three/drei';

import { absolute, flexCenter, fullSize, padding } from './styles';
import { State, StateDto } from './graph/types';

import { FlexColumn, FlexRow } from './components/base/Flex';
import {
  Button,
  Classes,
  Colors,
  Dialog,
  DialogBody,
  Intent,
  Tag,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { mod } from './utils/math';

import './App.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { CubeHandler } from './components/ivy-cube/CubeHandler';
import { genGraph, getSolvePath } from './graph/gen';
import { BaseViewModel, useViewModelConstructor } from './utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from './utils/mobx';
import { observer } from 'mobx-react-lite';
import { cubeColorKeys, cubeColors } from './utils';
import { action } from 'mobx';
import { createContext, useContext, useState } from 'react';
import { InfoDialog } from './components/dialogs/InfoDialog';

const graph = genGraph();

export enum Mode {
  Edit,
  Solve,
  Play,
}

export enum ExplodingState {
  Exploding,
  UnExploding,
  Done,
}

export class AppViewModel extends BaseViewModel {
  state = State.solved();
  mode = Mode.Play;

  // this is possibly the sloppiest code I've ever written but this
  // was the easiest hack I could come up with to fix the stupid turning bug
  doNotTurnPls = false;

  solvePath: StateDto[] | null = null;
  pathIndex = 0;
  prevPathIndex = null;

  editSelectedCenterColor: typeof cubeColorKeys[number] = 'white';

  constructor() {
    super();
    makeSimpleAutoObservable(
      this,
      {
        doNotTurnPls: false,
      },
      { autoBind: true },
    );
  }

  get pathState() {
    if (!this.solvePath) return State.solved();

    return this.solvePath[this.pathIndex];
  }

  get isSolvable() {
    return graph.has(this.state.id);
  }

  play() {
    this.doNotTurnPls = true;

    setTimeout(
      action(() => (this.doNotTurnPls = false)),
      1,
    );

    if (this.mode === Mode.Solve) {
      this.state = State.fromDto(this.pathState);
    }

    this.mode = Mode.Play;
  }

  edit() {
    this.doNotTurnPls = true;

    setTimeout(
      action(() => (this.doNotTurnPls = false)),
      1,
    );

    if (this.mode === Mode.Solve) {
      this.state = State.fromDto(this.pathState);
    }

    this.mode = Mode.Edit;
  }

  solve() {
    this.mode = Mode.Solve;

    this.doNotTurnPls = true;

    setTimeout(
      action(() => (this.doNotTurnPls = false)),
      1,
    );

    this.pathIndex = 0;

    const node = graph.get(this.state.id);

    if (!node) {
      console.error('Node not found in graph');

      this.mode = Mode.Edit;

      return;
    }

    this.solvePath = getSolvePath(node);
  }

  next() {
    if (this.solvePath) {
      this.pathIndex = mod(this.pathIndex + 1, this.solvePath.length);
    }
  }

  prev() {
    if (this.solvePath) {
      this.pathIndex = mod(this.pathIndex - 1, this.solvePath.length);
    }
  }

  reset() {
    this.doNotTurnPls = true;
    this.state = State.solved();
    setTimeout(
      action(() => (this.doNotTurnPls = false)),
      1,
    );
  }

  handleCornerClick(
    corner: 0 | 1 | 2 | 3,
    _side: 0 | 1 | 2 | undefined,
    rightClick: boolean,
  ) {
    if (this.mode === Mode.Solve) return;

    const clockwise = !rightClick;

    if (this.mode === Mode.Play) {
      this.state = this.state.rotate(corner, clockwise);
    }

    if (this.mode === Mode.Edit) {
      this.state = this.state.rotateCorner(corner, clockwise);
    }
  }

  handleCenterClick(center: 0 | 1 | 2 | 3 | 4 | 5, _rightClick: boolean) {
    this.doNotTurnPls = true;

    setTimeout(
      action(() => (this.doNotTurnPls = false)),
      1,
    );

    if (this.mode !== Mode.Edit) return;

    const newState = State.fromDto(this.state.dto);

    const colorMapping: Record<typeof cubeColorKeys[number], 0 | 1 | 2 | 3 | 4 | 5> = {
      white: 3,
      red: 5,
      blue: 0,
      green: 2,
      orange: 4,
      yellow: 1,
    };

    newState.centers[center] = colorMapping[this.editSelectedCenterColor];

    this.state = newState;
  }

  // Whoever wrote this exploding code did a terrible job
  explodingState: ExplodingState = ExplodingState.Done;
  explodingTimeMs = 500;
  explodeTimeout: number | null = null;

  explodeShuffle() {
    this.explodingState = ExplodingState.Exploding;
    this.explodeTimeout = setTimeout(
      action(() => {
        this.explodingState = ExplodingState.UnExploding;
        this.shuffle();
        this.explodeTimeout = setTimeout(
          action(() => {
            this.explodingState = ExplodingState.Done;
          }),
          this.explodingTimeMs,
        );
      }),
      this.explodingTimeMs,
    );
  }

  cancelExplode() {
    if (this.explodeTimeout) {
      clearTimeout(this.explodeTimeout);
    }

    this.explodingState = ExplodingState.Done;
  }

  shuffle() {
    const randomState = Array.from(graph.values())[Math.floor(Math.random() * graph.size)]
      .state;

    this.doNotTurnPls = true;

    setTimeout(
      action(() => (this.doNotTurnPls = false)),
      1,
    );

    this.state = randomState;
  }
}

export const AppViewModelContext = createContext<AppViewModel | null>(null);
export const useAppViewModel = () => {
  const vm = useContext(AppViewModelContext);

  if (!vm) {
    throw new Error('AppViewModelContext not found');
  }

  return vm;
};

export const App = observer(() => {
  const [showDialog, setShowDialog] = useState(false);

  const vm = useViewModelConstructor(AppViewModel);

  return (
    <AppViewModelContext.Provider value={vm}>
      <div
        className={Classes.DARK}
        css={[absolute(), fullSize, flexCenter, { background: Colors.BLACK }]}
      >
        <div
          css={[absolute(0, 0), padding('xl'), { zIndex: 100, pointerEvents: 'none' }]}
        >
          <div
            css={{
              pointerEvents: 'all',
            }}
          >
            <Button
              minimal
              icon={IconNames.InfoSign}
              onClick={() => setShowDialog((p) => !p)}
            />
            <InfoDialog
              isOpen={showDialog}
              onClose={() => {
                setShowDialog(false);
              }}
            />
          </div>
        </div>
        <FlexColumn
          alignItems="center"
          css={[
            absolute(0, 0, undefined, 0),
            padding('xl'),
            { zIndex: 100, pointerEvents: 'none' },
          ]}
          gap={5}
        >
          {vm.mode === Mode.Play && (
            <FlexRow
              gap={5}
              css={{
                pointerEvents: 'all',
              }}
            >
              <Button
                minimal
                onClick={vm.solve}
                icon={IconNames.PredictiveAnalysis}
                disabled={!vm.isSolvable}
                intent={vm.isSolvable ? undefined : Intent.WARNING}
                title={vm.isSolvable ? undefined : 'This cube is not solvable'}
              >
                Solve
              </Button>
              <Button minimal onClick={vm.edit} icon={IconNames.Edit}>
                Edit
              </Button>
              <Button minimal onClick={vm.explodeShuffle} icon={IconNames.Random}>
                Shuffle
              </Button>
            </FlexRow>
          )}
          {vm.mode === Mode.Edit && (
            <>
              <FlexRow
                gap={5}
                css={{
                  pointerEvents: 'all',
                }}
              >
                <Button
                  minimal
                  onClick={vm.solve}
                  icon={IconNames.PredictiveAnalysis}
                  disabled={!vm.isSolvable}
                  intent={vm.isSolvable ? undefined : Intent.WARNING}
                  title={vm.isSolvable ? undefined : 'This cube is not solvable'}
                >
                  Solve
                </Button>
                <Button minimal onClick={vm.play} icon={IconNames.Playbook}>
                  Play
                </Button>
                <Button minimal onClick={vm.reset} icon={IconNames.Reset}>
                  Reset
                </Button>
              </FlexRow>
              <FlexRow
                gap={5}
                css={{
                  pointerEvents: 'all',
                }}
              >
                {cubeColorKeys
                  .map((key) => ({ key, color: cubeColors[key] }))
                  .map(({ key, color }) => (
                    <Button
                      key={key}
                      minimal
                      onClick={action(() => {
                        vm.doNotTurnPls = true;

                        setTimeout(
                          action(() => (vm.doNotTurnPls = false)),
                          1,
                        );
                        vm.editSelectedCenterColor = key;
                      })}
                      css={[
                        {
                          backgroundColor: `${color} !important`,
                          width: 50,
                          height: 50,
                          filter: 'brightness(0.7)',
                          '&:hover': {
                            filter: 'brightness(1)',
                          },
                        },
                        vm.editSelectedCenterColor === key && {
                          filter: 'brightness(1)',
                          scale: '1.2',
                          zIndex: 1,
                        },
                      ]}
                    />
                  ))}
              </FlexRow>
            </>
          )}
          {vm.mode === Mode.Solve && vm.solvePath && (
            <FlexRow
              gap={5}
              css={{
                pointerEvents: 'all',
              }}
            >
              <Button minimal onClick={vm.play} icon={IconNames.Playbook}>
                Play
              </Button>
              <Button minimal onClick={vm.edit} icon={IconNames.Edit}>
                Edit
              </Button>
              <Button
                minimal
                disabled={vm.pathIndex <= 0}
                onClick={vm.prev}
                icon={IconNames.ChevronLeft}
              />
              <Tag large minimal css={{ width: 70, textAlign: 'center' }}>
                {vm.pathIndex + 1} / {vm.solvePath.length}
              </Tag>
              <Button
                minimal
                disabled={vm.pathIndex >= vm.solvePath.length - 1}
                onClick={vm.next}
                rightIcon={IconNames.ChevronRight}
              />
            </FlexRow>
          )}
        </FlexColumn>
        <Canvas
          camera={{
            position: [10, 10, 10],
          }}
        >
          <ambientLight />
          <directionalLight position={[0, 0, 5]} color="white" />
          <directionalLight position={[0, 0, -5]} color="white" />
          <directionalLight position={[0, 5, 0]} color="white" />
          <directionalLight position={[0, -5, 0]} color="white" />
          <CubeHandler
            onCornerClick={(corner, side) => vm.handleCornerClick(corner, side, false)}
            onCornerRightClick={(corner, side) =>
              vm.handleCornerClick(corner, side, true)
            }
            onCenterClick={(center) => vm.handleCenterClick(center, false)}
            onCenterRightClick={(center) => vm.handleCenterClick(center, true)}
            state={vm.mode === Mode.Solve ? vm.pathState : vm.state}
          />
          <OrbitControls enablePan={false} target={[0, 0, 0]} />
        </Canvas>
      </div>
    </AppViewModelContext.Provider>
  );
});
