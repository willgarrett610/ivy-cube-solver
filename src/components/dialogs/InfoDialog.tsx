import { Dialog, DialogBody, Divider } from '@blueprintjs/core';

export interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoDialog = (props: InfoDialogProps) => {
  const { isOpen, onClose } = props;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Ivy Cube Solver" icon="info-sign">
      <DialogBody>
        <p>
          This Ivy Cube Solver was made in a weekend also without a lot of time during
          said weekend, so there are issues with this... ignore them :)
        </p>
        <Divider />
        <p>
          The Ivy Cube possesses six centers and four corners total. The centers can have
          any even permutation, which amounts to{' '}
          <span
            css={{
              fontWeight: 'bold',
              // disable wrap
              whiteSpace: 'nowrap',
            }}
          >
            (6!/2)
          </span>{' '}
          ways. The corners meanwhile can each be rotated one of three ways, with a single
          twisted corner being solvable. giving it{' '}
          <span
            css={{
              fontWeight: 'bold',
              // disable wrap
              whiteSpace: 'nowrap',
            }}
          >
            34
          </span>{' '}
          arrangements.
        </p>
        <p>
          This gives us the equation for the total permutation number, which is{' '}
          <span
            css={{
              fontWeight: 'bold',
              // disable wrap
              whiteSpace: 'nowrap',
            }}
          >
            (6!/2) * (34)
          </span>{' '}
          This overall leads to the Ivy Cube having{' '}
          <span
            css={{
              fontWeight: 'bold',
              // disable wrap
              whiteSpace: 'nowrap',
            }}
          >
            29,160
          </span>{' '}
          permutations, which is quite small by normal Rubik&apos;s twisty puzzle
          standards. (<a href="https://rubiks.fandom.com/wiki/Ivy_Cube">WikiCube</a>)
        </p>
        <Divider />
        <p>
          To use the cube, simply click the corners to rotate them. Left click to rotate
          clockwise and right click to rotate counter-clockwise.
        </p>
        <p>
          In Edit mode, when you click a corner, only that corner will rotate with no
          center pieces rotating. Then to change the centers, click the color you want to
          change to and then click the center you want to change.
        </p>
        <p>
          To solve the cube, click the Solve button. The solver will then find the optimal
          solution to the cube.
        </p>
        <Divider />
        <p>
          This tool was created by{' '}
          <a href="https://github.com/willgarrett610">Will Garrett</a> and{' '}
          <a href="https://github.com/justinfernald">Justin Fernald</a>
        </p>
        <p>
          <a href="https://github.com/willgarrett610/ivy-cube-solver/">View Source</a>
        </p>
      </DialogBody>
    </Dialog>
  );
};
