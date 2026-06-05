import { useLoaderData } from "react-router"
import useDetailProjectContext from "./useDetailProjectContext";
import { useMemo, useState } from "react";
import { MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PointerSensor } from "@dnd-kit/react";
import { DRAG_LIST } from "@/utils/constants";

const useDetailProjectContainer = () => {
    const detailProjectData = useLoaderData();
    const detailProjectContext = useDetailProjectContext();

    const [activeDragItem, setActiveDragItem] = useState(null);
    const boardListData = detailProjectContext.boardListData;

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint:{
            distance: 10,
        }
    });

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint:{
            distance: 5,
        }
    })

    const sensors = useSensors(mouseSensor, pointerSensor);

    const handleDragStart = (event) => {
        setActiveDragItem(event.active.data.current);
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;
        setActiveDragItem(null);

        if(!over) return;
        
        const isDragListType =  active.data.current.type == DRAG_LIST && over.data.current.type === DRAG_LIST;
        
        const isSameList =  active.data.current.list_internal_id == (
            over.data.current.list_internal_id || over.data.current.internal_id
        );

        detailProjectContext.setUpdateTaskItemPosition({
            active: active.data.current,
            over: over.data.current,
            isDragListType,
            is
        });
    }

    const handleDragCancel = () => {
        setActiveDragItem(null);
    }

    const boardListDataMapPublicIds = useMemo(()=> {
        return boardListData.map((item) => item.public_id);
    },[boardListData])

    return {
        detailProjectData,
        detailProjectContext,
        boardListData,
        boardListDataMapPublicIds,
        activeDragItem,
        sensors,
        handleDragStart,
        handleDragEnd,
        handleDragCancel
    }
}

export default useDetailProjectContainer