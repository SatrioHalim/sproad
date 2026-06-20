import { Stack } from '@mui/material';
import { useLoaderData } from 'react-router';

import useDetailProjectContext from '../hooks/useDetailProjectContext';

import CreateNewList from './CreateNewList';
import ListSortableItem from './ListSortableItem';

import SidebarLayout from '@/components/layouts/sidebarlayout';
import useDetailProjectContainer from '../hooks/useDetailProjectContainer';
import { defaultDropAnimation, defaultDropAnimationSideEffects, DndContext, DragOverlay } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { DRAG_LIST } from '@/utils/constants';

const DetailProjectContainer = () => {
  const {
    boardListData,
    detailProjectData,
    detailProjectContext,
    activeDragItem,
    boardListDataMapPublicIds,
    handleDragCancel,
    handleDragEnd,
    handleDragStart,
    sensors
  } = useDetailProjectContainer();

  const renderDragOverlay = () => {
    if(activeDragItem && activeDragItem.type == DRAG_LIST){
      return (
        <ListSortableItem id={activeDragItem.public_id} item={activeDragItem}></ListSortableItem>
      )
    }
    return <></>
  }

  return (
    <SidebarLayout
      pageTitle={`${detailProjectData.title} (${detailProjectContext.getProjectInitials})`}
      breadcrumbs={[
        {
          label: 'Project List',
          href: '/projects',
        },
        {
          label: detailProjectData.title,
          href: `/projects/${detailProjectData.public_id}`,
        },
      ]}
    >
      <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
      >
        <SortableContext
          items={boardListDataMapPublicIds}
          strategy={horizontalListSortingStrategy}
        >
          <Stack
        direction={'row'}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 2,
          pb: 5,
          overflowX: 'auto',
        }}
      >
        {
          boardListData?.map((item)=> (
            <ListSortableItem key={item.public_id} id={item.public_id} item={item}></ListSortableItem>
          ))
        }
        <CreateNewList />
      </Stack>
        </SortableContext>
        <DragOverlay
          dropAnimation={{ 
            sideEffects:defaultDropAnimationSideEffects({
              styles:{
                active:{
                  opacity:'0.4'
                }
              }
            })
           }}
        >
          {renderDragOverlay()}
        </DragOverlay>         
      </DndContext>
     
    </SidebarLayout>
  );
};

export default DetailProjectContainer;
