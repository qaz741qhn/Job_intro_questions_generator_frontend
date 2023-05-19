import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetch from "./useFetch";
import './History.css';

const History = ({apiURL}) => {
  const { id } = useParams();
  const {
    data: generatedHistory,
    isPending,
    error,
  } = useFetch(`${apiURL}/generated_histories/${id}`);


  return (
    <div className="container">
      <div className="history-details">
        {isPending && <div className="is-pending">讀取中...</div>}
        {generatedHistory && (
          <div className="content-container">
            <div className="content">{generatedHistory.content}</div>
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </div>
      <div className="back-button">
        <Link to="/history">返回所有歷史紀錄</Link>
      </div>
    </div>
  );
};

export default History;
