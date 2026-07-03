import { useEffect, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router"
import useDetailProjectContext from "../../detail_project/hooks/useDetailProjectContext";
import services from "@/services";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

const useModalTaskDetail = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [taskDetailData, setTaskDetailData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [editTitle, setEditTitle] = useState(false);
    const [editDueDate, setEditDueDate] = useState(false);
    const [editAssignee, setEditAssignee] = useState(false);
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

    const detailProjectData = useLoaderData();
    const detailProjectContext = useDetailProjectContext();

    const taskId = searchParams.get('taskId');
    const listId = searchParams.get('listId');

    const formTask = useForm();

    const fetchTaskDetail = async (taskId) => {
        const response = await services.cards.getDetail(taskId);
        setTaskDetailData(response.data.data);
    }

    const onSubmit = async (values) => {
        setIsLoading(true);
        await services.cards.update(taskDetailData.public_id, {
            list_id: listId,
            title: values.title ?? taskDetailData.title,
            description: values.description ?? taskDetailData.description,
            due_date: values.due_date ?? taskDetailData.due_date,
            position: taskDetailData.position,
        });
        await fetchTaskDetail(taskId);
        setIsLoading(false);
        setEditDescription(false);
        setEditTitle(false);
        setEditDueDate(false);
    }

    const handleDeleteTask = async () => {
        setIsLoading(true);
        await services.cards.remove(taskDetailData.public_id);
        handleClose();
    }

    const handleClose = async () => {
        setSearchParams({});
        setIsLoading(false);
        setIsShowConfirmDelete(false);
        await detailProjectContext.fetchBoardLists();
    }

    useEffect(() => {
        if(taskId && listId){
            fetchTaskDetail(taskId);
        }
    }, [taskId,listId])

    return {
        searchParams,
        taskDetailData,
        isLoading,
        editDescription,
        editTitle,
        editDueDate,
        editAssignee,
        isShowConfirmDelete,
        setSearchParams,
        setTaskDetailData,
        setIsLoading,
        setEditDescription,
        setEditTitle,
        setEditDueDate,
        setEditAssignee,
        setIsShowConfirmDelete,
        detailProjectData,
        detailProjectContext,
        taskId,
        listId,
        formTask,
        onSubmit,
        handleDeleteTask,
        handleClose
    }
}

export default useModalTaskDetail