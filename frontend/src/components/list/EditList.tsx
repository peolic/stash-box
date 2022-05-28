import { FC } from "react";

import { useEditFilter, usePagination } from "src/hooks";
import {
  useEdits,
  TargetTypeEnum,
  SortDirectionEnum,
  VoteStatusEnum,
  OperationEnum,
  EditSortEnum,
} from "src/graphql";
import { ErrorMessage } from "src/components/fragments";
import EditCard from "src/components/editCard";
import List from "./List";

interface EditsProps {
  id?: string;
  containing?: {
    id: string;
    type: TargetTypeEnum;
  };
  sort?: EditSortEnum;
  direction?: SortDirectionEnum;
  type?: TargetTypeEnum;
  status?: VoteStatusEnum;
  operation?: OperationEnum;
  userId?: string;
  defaultVoteStatus?: VoteStatusEnum;
}

const PER_PAGE = 20;

const EditListComponent: FC<EditsProps> = ({
  id,
  containing,
  sort,
  direction,
  type,
  status,
  operation,
  userId,
  defaultVoteStatus,
}) => {
  const { page, setPage } = usePagination();
  const {
    editFilter,
    selectedSort,
    selectedDirection,
    selectedType,
    selectedOperation,
    selectedStatus,
    selectedFavorite,
  } = useEditFilter({
    sort,
    direction,
    type,
    status,
    operation,
    showFavoriteOption: id === undefined,
    defaultVoteStatus,
  });
  const { data, loading } = useEdits({
    input: {
      target_type: selectedType,
      target_id: id,
      containing_id: containing?.id,
      containing_type: containing?.type,
      status: selectedStatus,
      operation: selectedOperation,
      user_id: userId,
      is_favorite: selectedFavorite,
      page,
      per_page: PER_PAGE,
      sort: selectedSort,
      direction: selectedDirection,
    },
  });

  if (!loading && !data) return <ErrorMessage error="Failed to load edits." />;

  const edits =
    data?.queryEdits?.edits.map((edit) => (
      <EditCard edit={edit} key={edit.id} />
    )) ?? [];

  return (
    <List
      entityName="edits"
      loading={loading}
      listCount={data?.queryEdits.count}
      filters={editFilter}
      page={page}
      setPage={setPage}
    >
      <div>{edits}</div>
    </List>
  );
};

export default EditListComponent;
