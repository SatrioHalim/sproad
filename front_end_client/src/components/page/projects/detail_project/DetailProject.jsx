import DetailProjectContainer from "./components/DetailProjectContainer";
import DetailProjectProvider from "./DetailProjectContext";

const DetailProject = () => {
  return (
    <DetailProjectProvider>
      <DetailProjectContainer></DetailProjectContainer>
    </DetailProjectProvider>
  )
}

export default DetailProject