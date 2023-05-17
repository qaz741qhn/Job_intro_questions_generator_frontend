import { useState } from "react";
import "./InputForm.css";

const Input = ({ value, onChange, label, placeholder }) => (
  <label>
    {label}:
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </label>
);

const TextArea = ({ value, onChange, label, placeholder }) => (
  <label>
    {label}:
    <textarea value={value} onChange={onChange} placeholder={placeholder} />
  </label>
);

const fetchAPI = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const InputForm = ({ apiURL }) => {
  const [formData, setFormData] = useState({
    education: "",
    experience: "",
    interestedRole: "",
    companyInfo: "",
    abilities: [],
    professionalValuesInterests: [],
    softSkills: [],
  });

  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedInterviewQuestion, setGeneratedInterviewQuestion] =
    useState("");
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const maxStep = 6;
  const [isSelfIntroPending, setIsSelfIntroPending] = useState(false);
  const [isQuestionPending, setIsQuestionPending] = useState(false);

  const saveHistory = (history_type, keywords, content) => {
    const body = { generated_history: { history_type, keywords, content } };
    fetch(`${apiURL}/generated_histories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).catch((error) => console.error("Error:", error));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSelfIntroPending(true);

    const body = {
      prompt: `請為一位學歷為${formData.education}、擁有${formData.experience}經驗的求職者，產生一段求職面試的300～400字中文自我介紹。`,
    };

    try {
      const data = await fetchAPI(
        `${apiURL}/job_applications/generate_content`,
        body
      );
      setGeneratedContent(data.generated_content);
      saveHistory("自我介紹", formData, data.generated_content);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSelfIntroPending(false);
    }
  };

  const generateInterviewQuestion = async () => {
    setIsQuestionPending(true);

    const body = {
      prompt: `請產生一系列可能會在求職面試中，提問給一位教育程度為${formData.education}、擁有${formData.experience}經驗的求職者的中文問題。該求職者精通${formData.abilities}，並且對於${formData.professionalValuesInterests}有所涉獵。`,
    };

    try {
      const data = await fetchAPI(
        `${apiURL}/job_applications/generate_interview_question`,
        body
      );
      setGeneratedInterviewQuestion(data.generated_interview_questions);
      saveHistory("面試問題", formData, data.generated_interview_questions);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsQuestionPending(false);
    }
  };

  const nextInput = () => {
    setCurrentInputIndex((prevIndex) => prevIndex + 1);
  };

  const backToPreviousInput = () => {
    setCurrentInputIndex((prevIndex) => prevIndex - 1);
  };

  const backToFirstInput = () => {
    setCurrentInputIndex(0);
  };

  const inputFields = [
    {
      key: "education",
      label: "學歷",
      placeholder: "請輸入你的學歷",
      Component: Input,
    },
    {
      key: "experience",
      label: "工作經驗",
      placeholder: "請輸入你的工作經驗",
      Component: TextArea,
    },
    {
      key: "interestedRole",
      label: "感興趣的職位",
      placeholder: "請輸入你感興趣的職位",
      Component: Input,
    },
    {
      key: "companyInfo",
      label: "面試公司資訊",
      placeholder: "請輸入你面試的公司資訊",
      Component: TextArea,
    },
    {
      key: "abilities",
      label: "技術能力",
      placeholder: "請輸入你的技術能力，以逗號分隔，例如：React, JavaScript",
      Component: Input,
    },
    {
      key: "professionalValuesInterests",
      label: "專業價值與興趣",
      placeholder:
        "請輸入你的專業價值與興趣，以逗號分隔，例如：前端開發, 資料分析",
      Component: Input,
    },
    {
      key: "softSkills",
      label: "軟實力",
      placeholder: "請輸入你的軟實力，以逗號分隔，例如：溝通能力, 團隊合作",
      Component: Input,
    },
  ];

  const inputs = inputFields.map(({ key, label, placeholder, Component }) => (
    <Component
      value={formData[key]}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, [key]: e.target.value }))
      }
      label={label}
      placeholder={placeholder}
    />
  ));

  return (
    <form onSubmit={handleSubmit}>
      {inputs[currentInputIndex]}
      {currentInputIndex < maxStep && (
        <button type="button" onClick={nextInput}>
          下一個（{inputs[currentInputIndex + 1].props.label}）
        </button>
      )}
      {currentInputIndex > 0 && currentInputIndex <= maxStep && (
        <button type="button" onClick={backToPreviousInput}>
          上一個（{inputs[currentInputIndex - 1].props.label}）
        </button>
      )}
      {currentInputIndex === maxStep && (
        <button type="button" onClick={backToFirstInput}>
          回到第一個
        </button>
      )}
      {!isSelfIntroPending && <button type="submit">產生自我介紹</button>}
      {isSelfIntroPending && (
        <button disabled className="disabled">
          正在產生自我介紹...
        </button>
      )}
      <p>{generatedContent}</p>
      {!isQuestionPending && (
        <button type="button" onClick={generateInterviewQuestion}>
          產生面試問題
        </button>
      )}
      {isQuestionPending && (
        <button disabled className="disabled">
          正在產生面試問題...
        </button>
      )}
      <ul>
        {generatedInterviewQuestion.split("\n").map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </form>
  );
};

export default InputForm;
