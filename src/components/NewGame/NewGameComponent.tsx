import React, { memo, useCallback } from 'react';
import { Container, Typography, Fab, Grid, Card, CardActions, CircularProgress } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { useNewGame } from './hooks';
import { useStyles } from './NewGame.styles';
import { Stepper } from './Stepper';
import { GameName } from './GameName';
import { GameTeams } from './GameTeams';
import { TeamColors } from './TeamColors';
import { GameRules } from './GameRules';
import { GameReview } from './GameReview';

interface NewGameProps {
  newGameLoading: boolean;
  newGame: () => void;
}

const NewGameComponent: React.FC<NewGameProps> = ({ newGameLoading }) => {
  const { root, pageTitle, content, card, cardAction, cardValidationRed, cardValidationGreen, loader } = useStyles();
  const {
    steps,
    rules,
    setup,
    teamColors,
    teams,
    colorsList,
    error,
    checkStep,
    activeStep,
    completedSteps,
    getValidationNotes,
    gameSubmitted,
    onSetStep,
    onTeamsChange,
    onGameNameChange,
    onTeamColorsChange,
    onGameRulesChange,
    onPredefinedGameRuleChange,
  } = useNewGame();

  const handleActiveStep = useCallback(
    (step?: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onSetStep(step);
    },
    [onSetStep]
  );

  const getStepContent = useCallback(
    (step: number) => {
      const { gameName } = setup;
      switch (step) {
        case 0:
          return <GameName gameName={gameName} onChange={onGameNameChange} />;
        case 1:
          return <GameRules rules={rules} onChange={onGameRulesChange} onGameRuleChange={onPredefinedGameRuleChange} />;
        case 2:
          return <GameTeams teams={teams} onChange={onTeamsChange} />;
        case 3:
          return <TeamColors teams={teams} colors={colorsList} teamColors={teamColors} onChange={onTeamColorsChange} />;
        case 4:
          return <GameReview gameName={gameName} rules={rules} teams={teams} teamColors={teamColors} />;
        case 5:
          return (
            (!error && (
              <div className={loader}>
                <CircularProgress size={60} thickness={4} color="primary" className={content} />
                <Typography>Please, wait for your scoreboard to be created...</Typography>
              </div>
            )) || (
              <div className={loader}>
                <Typography>{error}</Typography>
              </div>
            )
          );
        default:
          return 'Unknown step';
      }
    },
    [
      setup,
      onGameNameChange,
      rules,
      onGameRulesChange,
      onPredefinedGameRuleChange,
      teams,
      onTeamsChange,
      colorsList,
      teamColors,
      onTeamColorsChange,
      error,
      loader,
      content,
    ]
  );

  const isValid = checkStep(activeStep);

  return (
    <Container maxWidth="md" component="main" className={`${root} NewGame`}>
      <Typography component="h1" variant="h2" align="center" color="textPrimary" className={pageTitle}>
        Create A New Game
      </Typography>

      <Grid container justify="center">
        <Grid item xs={12} md={10}>
          <Card className={card} elevation={10}>
            <Stepper activeStep={activeStep} steps={steps} onStepClick={handleActiveStep} completed={completedSteps} />
            {getStepContent(activeStep)}
            <CardActions className={isValid ? cardValidationGreen : cardValidationRed} disableSpacing>
              <Typography align="right" className={cardAction}>
                {getValidationNotes(activeStep)}
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container justify="center">
        <Grid item xs={12} md={10}>
          <Grid container justify="space-between">
            {activeStep <= steps.length && (
              <Fab
                className="prevStep"
                variant="extended"
                color="primary"
                aria-label="prev"
                disabled={!activeStep || gameSubmitted}
                onClick={handleActiveStep(activeStep - 1)}
              >
                <NavigateBeforeIcon />
                Prev
              </Fab>
            )}

            {activeStep < steps.length && (
              <Fab
                className="nextStep"
                variant="extended"
                color="primary"
                aria-label="next"
                onClick={handleActiveStep()}
                disabled={!isValid || gameSubmitted}
              >
                Next
                <NavigateNextIcon />
              </Fab>
            )}

            {activeStep === steps.length && (
              <Fab
                className="completeStep"
                variant="extended"
                color="primary"
                aria-label="complete"
                onClick={handleActiveStep()}
                disabled={gameSubmitted || completedSteps.length < steps.length}
              >
                Let's Go!
                <NavigateNextIcon />
              </Fab>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export const Component = memo(NewGameComponent);
