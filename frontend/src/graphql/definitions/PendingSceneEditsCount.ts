/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TargetTypeEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: PendingSceneEditsCount
// ====================================================

export interface PendingSceneEditsCount_queryEdits {
  __typename: "QueryEditsResultType";
  count: number;
}

export interface PendingSceneEditsCount {
  queryEdits: PendingSceneEditsCount_queryEdits;
}

export interface PendingSceneEditsCountVariables {
  type: TargetTypeEnum;
  containingType: TargetTypeEnum;
  containingID: string;
}
