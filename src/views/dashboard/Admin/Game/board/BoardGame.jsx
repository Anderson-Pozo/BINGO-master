import { Grid } from '@mui/material';
import { uiStyles } from '../Game.styles';
import { titles } from '../Game.texts';
import { bingoBBalls, bingoGBalls, bingoIBalls, bingoNBalls, bingoOBalls } from 'utils/generateBoard';

export const BoardGame = ({ number, letter, prevNumber, prevLetter }) => {
  let b = bingoBBalls();
  let i = bingoIBalls();
  let n = bingoNBalls();
  let g = bingoGBalls();
  let o = bingoOBalls();

  return (
    <>
      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.bgPanelBallActual}>
              <center>
                <div style={uiStyles.ball}>
                  <h1>{letter}</h1>
                  <h1>{number}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.bgPanelBallAnte}>
              <center>
                <div style={uiStyles.ball}>
                  <h1>{prevLetter}</h1>
                  <h1>{prevNumber}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBall}>
              <center>
                <span style={uiStyles.panelText}>{titles.actual}</span>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBall}>
              <center>
                <span style={uiStyles.panelText}>{titles.ante}</span>
              </center>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.b}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {b.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1.5} md={1.5} sm={1.5} xs={1.5} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.b}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.i}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {i.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1.5} md={1.5} sm={1.5} xs={1.5} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.i}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.n}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {n.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1.5} md={1.5} sm={1.5} xs={1.5} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.n}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.g}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {g.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1.5} md={1.5} sm={1.5} xs={1.5} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.g}</h3>
            </Grid>

            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.o}</h3>
            </Grid>
            <Grid item lg={10} md={10} sm={10} xs={10} sx={uiStyles.midCol}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {o.map((item) => (
                    <Grid id={'btn' + item} key={item} item lg={1.5} md={1.5} sm={1.5} xs={1.5} sx={uiStyles.midCell}>
                      <h4 style={uiStyles.cellItem}>{item}</h4>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1} sx={uiStyles.leftCell}>
              <h3 style={uiStyles.cellLetter}>{titles.o}</h3>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBallEndLeft}>
              <center>
                <span style={uiStyles.panelText}>{''}</span>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBallEndRight}>
              <center>
                <span style={uiStyles.panelText}>{''}</span>
              </center>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
