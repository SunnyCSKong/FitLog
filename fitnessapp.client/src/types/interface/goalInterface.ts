export enum Status {
  Incomplete = "Incomplete",
  InProgress = "InProgress",
  Complete = "Complete",
}

export default interface IGoalInterface {
  id: string;
  Name: string;
  Description: string;
  Status: Status;
  Deadline: Date;
}
