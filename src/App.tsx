/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';

import { OrbitControls } from '@react-three/drei';

import { absolute, flexCenter, fullSize, padding } from './styles';
import { State, StateDto } from './graph/types';

import { FlexColumn, FlexRow } from './components/base/Flex';
import { Button, Classes, Colors, Intent, Tag } from '@blueprintjs/core';
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

const graph = genGraph();

export enum Mode {
  Edit,
  Solve,
  Play,
}

export class AppViewModel extends BaseViewModel {
  state = State.solved();
  mode = Mode.Play;

  solvePath: StateDto[] | null = null;
  pathIndex = 0;
  prevPathIndex = null;

  editSelectedCenterColor: typeof cubeColorKeys[number] = 'white';

  constructor() {
    super();
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }

  get pathState() {
    if (!this.solvePath) return State.solved();

    return this.solvePath[this.pathIndex];
  }

  get isSolvable() {
    return graph.has(this.state.id);
  }

  play() {
    if (this.mode === Mode.Solve) {
      this.state = State.fromDto(this.pathState);
    }

    this.mode = Mode.Play;
  }

  edit() {
    if (this.mode === Mode.Solve) {
      this.state = State.fromDto(this.pathState);
    }

    this.mode = Mode.Edit;
  }

  solve() {
    this.mode = Mode.Solve;

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

  handleCornerClick(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined) {
    if (this.mode === Mode.Solve) return;

    if (this.mode === Mode.Play) {
      this.state = this.state.rotate(corner, true);
    }

    if (this.mode === Mode.Edit) {
      this.state = this.state.rotateCorner(corner, true);
    }
  }

  handleCenterClick(center: 0 | 1 | 2 | 3 | 4 | 5) {
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
}

export const App = observer(() => {
  const vm = useViewModelConstructor(AppViewModel);

  return (
    <div
      className={Classes.DARK}
      css={[absolute(), fullSize, flexCenter, { background: Colors.BLACK }]}
    >
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
          position: [15, 15, 15],
        }}
      >
        <ambientLight />
        <directionalLight position={[0, 0, 5]} color="white" />
        <directionalLight position={[0, 0, -5]} color="white" />
        <directionalLight position={[0, 5, 0]} color="white" />
        <directionalLight position={[0, -5, 0]} color="white" />
        <CubeHandler
          onCornerClick={vm.handleCornerClick}
          onCenterClick={vm.handleCenterClick}
          state={vm.mode === Mode.Solve ? vm.pathState : vm.state}
        />
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
});
