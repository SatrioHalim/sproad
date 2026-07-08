import ModalTaskDetailContainer from './ModalTaskDetailContainer';
import ModalTaskDetailProvider from './ModalTaskDetailContext';

const ModalTaskDetail = () => {
  return (
    <ModalTaskDetailProvider>
      <ModalTaskDetailContainer />
    </ModalTaskDetailProvider>
  );
};

export default ModalTaskDetail;
