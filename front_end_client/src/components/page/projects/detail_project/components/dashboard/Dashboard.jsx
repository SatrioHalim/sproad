import { Stack, Typography } from "@mui/material";
import DashboardMetric from "./metrics/DashboardMetric";
import { AccessTimeFilled, Assignment, WarningAmber } from "@mui/icons-material";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardWorkload from "./charts/DashboardWorkload";
import DashboardTaskPercentage from "./charts/DashboardTaskPercentage";

const Dashboard = () => {
    const {
        totalTaskSummary,
        overdueTasksSummary,
        dueSoonTasksSummary,
        workloadSummary,
        taskPercentageSummary
    } = useDashboardData();
    return (
        <Stack sx={{ 
            width:'100%',
            gap:3,
            mt:5
         }}>
            <Stack 
            direction={'row'}
            sx={{ 
                gap:1,
                justifyContent:'stretch',
                alignItems:'stretch'
             }}>
                <DashboardMetric
                title={'Project Task Total'}
                value={totalTaskSummary.length}
                icon={Assignment}
                color={'#1976d2'}
                ></DashboardMetric>
                <DashboardMetric
                title={'Project Task Overdue Total'}
                value={overdueTasksSummary.length}
                icon={AccessTimeFilled}
                color={'#d32f2f'}
                ></DashboardMetric>
                <DashboardMetric
                title={'Project Task Due Soon Total'}
                value={dueSoonTasksSummary.length}
                icon={WarningAmber}
                color={'#ffa000'}
                ></DashboardMetric>
            </Stack>
            <Stack direction={'row'} sx={{ 
                gap:1,
                height:500
             }}>
                <Stack sx={{ 
                    gap:3,
                    flex:1
                 }}>
                    <Typography variant="h5">Work Distribution</Typography>
                    <DashboardTaskPercentage data={taskPercentageSummary}></DashboardTaskPercentage>
                 </Stack>
                <Stack sx={{ 
                    gap:3,
                    flex:1
                 }}>
                    <Typography variant="h5">Work assign</Typography>
                    <DashboardWorkload data={workloadSummary}></DashboardWorkload>
                 </Stack>
             </Stack>
        </Stack>
    )

}

export default Dashboard;