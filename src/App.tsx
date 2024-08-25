/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';

import { OrbitControls } from '@react-three/drei';

import { absolute, flexCenter, fullSize, padding } from './styles';
import { useEffect, useMemo, useState } from 'react';
import { StateDto } from './graph/types';

import { FlexColumn, FlexRow } from './components/base/Flex';
import { Button, Classes, Colors, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { mod } from './utils/math';
import { IvyCube } from './components/ivy-cube/IvyCube';

import { getTurnFromStateChange } from './graph/util';

import './App.css';
import '@blueprintjs/core/lib/css/blueprint.css';

// const path = getSolvePath(genGraph()!);
const path = [
  {
    corners: [2, 1, 1, 2],
    centers: [0, 3, 2, 1, 5, 4],
  },
  {
    corners: [1, 1, 1, 2],
    centers: [5, 0, 2, 1, 3, 4],
  },
  {
    corners: [1, 1, 2, 2],
    centers: [5, 4, 0, 1, 3, 2],
  },
  {
    corners: [2, 1, 2, 2],
    centers: [4, 3, 0, 1, 5, 2],
  },
  {
    corners: [2, 1, 0, 2],
    centers: [4, 2, 3, 1, 5, 0],
  },
  {
    corners: [0, 1, 0, 2],
    centers: [2, 5, 3, 1, 4, 0],
  },
  {
    corners: [1, 1, 0, 2],
    centers: [5, 4, 3, 1, 2, 0],
  },
  {
    corners: [1, 1, 0, 0],
    centers: [1, 4, 3, 0, 2, 5],
  },
  {
    corners: [1, 2, 0, 0],
    centers: [1, 4, 0, 2, 3, 5],
  },
  {
    corners: [1, 0, 0, 0],
    centers: [1, 4, 2, 3, 0, 5],
  },
  {
    corners: [2, 0, 0, 0],
    centers: [4, 0, 2, 3, 1, 5],
  },
  {
    corners: [0, 0, 0, 0],
    centers: [0, 1, 2, 3, 4, 5],
  },
] satisfies StateDto[];

export const animationTimeMs = 2_500;

function App() {
  const [prevPathIndex, setPrevPathIndex] = useState<number | null>(null);
  const [pathIndex, setPathIndex] = useState(0);

  const incrementPathIndex = () => {
    setPrevPathIndex(pathIndex);
    setPathIndex((prev) => mod(prev + 1, path.length));
  };

  const decrementPathIndex = () => {
    setPrevPathIndex(pathIndex);
    setPathIndex((prev) => mod(prev - 1, path.length));
  };

  const prevPathState = prevPathIndex !== null ? path[prevPathIndex] : undefined;
  const pathState = path[pathIndex];

  const turn = useMemo(
    () =>
      prevPathState !== undefined
        ? getTurnFromStateChange(prevPathState, pathState)
        : undefined,
    [prevPathState, pathState],
  );

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
        <FlexRow
          gap={5}
          css={{
            pointerEvents: 'all',
          }}
        >
          <Button
            minimal
            disabled={pathIndex <= 0}
            onClick={decrementPathIndex}
            icon={IconNames.ChevronLeft}
          />
          <Tag large minimal css={{ width: 70, textAlign: 'center' }}>
            {pathIndex + 1} / {path.length}
          </Tag>
          <Button
            minimal
            disabled={pathIndex >= path.length - 1}
            onClick={incrementPathIndex}
            rightIcon={IconNames.ChevronRight}
          />
        </FlexRow>
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
        <IvyCube prevCubeState={prevPathState} cubeState={pathState} turn={turn} />
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
