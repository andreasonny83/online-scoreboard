export type TeamColor =
  | 'white'
  | 'red'
  | 'yellow'
  | 'blue'
  | 'green'
  | 'gray'
  | 'pink'
  | 'brown'
  | 'lime'
  | 'teal'
  | 'purple'
  | 'gold'
  | 'aquamarine'
  | 'darkorange'
  | 'black';

export type ScoringSystem = 'increase' | 'decrease' | 'both';

export type GameListItem = {
  name: string;
  minTeamSize: string;
  maxTeamSize: string;
  startingScore: string;
  winningScore: string;
  winningScoreEnabled: boolean;
  scoringSystem: ScoringSystem;
  isMatchesBased: boolean;
};
