import { useState } from "react";
import "./InputForm.css";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://remarkable-lokum-400dc6.netlify.app";

const Input = ({ value, onChange, label }) => (
  <label>
    {label}:
    <input type="text" value={value} onChange={onChange} />
  </label>
);

const TextArea = ({ value, onChange, label }) => (
  <label>
    {label}:
    <textarea value={value} onChange={onChange} />
  </label>
);

const fetchAPI = (url, body) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

const InputForm = () => {
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [interestedRole, setInterestedRole] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [abilities, setAbilities] = useState(""); // ["ability1", "ability2"]
  const [professionalValuesInterests, setProfessionalValuesInterests] =
    useState(""); // ["value1", "value2"
  const [softSkills, setSoftSkills] = useState(""); // ["softSkill1", "softSkill2"
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedInterviewQuestion, setGeneratedInterviewQuestion] =
    useState("");
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const maxStep = 6;

  const handleSubmit = (event) => {
    event.preventDefault();

    const body = {
      prompt: `請為一位學歷為${education}、擁有${experience}經歷的求職者，產生一段求職面試的300～400字中文自我介紹。他在${abilities}上有深厚的技術能力，並對${professionalValuesInterests}有一定的了解及熱忱，具有出色的${softSkills}。`,
    };

    fetchAPI(`${apiURL}/job_applications/generate_content`, body).then(
      (data) => {
        setGeneratedContent(data.generated_content);
      }
    );
  };

  const generateInterviewQuestion = () => {
    const body = {
      prompt: `請產生一系列可能會在求職面試中，提問給一位教育程度為${education}、具有${experience}經驗的求職者的中文問題。該求職者精通${abilities}，並且對於${professionalValuesInterests}有所涉獵。`,
    };

    fetchAPI(
      `${apiURL}/job_applications/generate_interview_question`,
      body
    ).then((data) => {
      setGeneratedInterviewQuestion(data.generated_interview_questions);
      console.log(data.generated_interview_questions);
    });
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

  const inputs = [
    <Input
      value={education}
      onChange={(e) => setEducation(e.target.value)}
      label="學歷"
    />,
    <TextArea
      value={experience}
      onChange={(e) => setExperience(e.target.value)}
      label="工作經驗"
    />,
    <Input
      value={interestedRole}
      onChange={(e) => setInterestedRole(e.target.value)}
      label="感興趣的職位"
    />,
    <TextArea
      value={companyInfo}
      onChange={(e) => setCompanyInfo(e.target.value)}
      label="面試公司資訊"
    />,
    <Input
      value={abilities}
      onChange={(e) => setAbilities(e.target.value)}
      label="技術能力"
    />,
    <Input
      value={professionalValuesInterests}
      onChange={(e) => setProfessionalValuesInterests(e.target.value)}
      label="專業價值與興趣"
    />,
    <Input
      value={softSkills}
      onChange={(e) => setSoftSkills(e.target.value)}
      label="軟實力"
    />,
  ];

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
      <button type="submit">產生自我介紹</button>
      <p>{generatedContent}</p>
      <button type="button" onClick={generateInterviewQuestion}>
        產生面試問題
      </button>
      <ul>
        {generatedInterviewQuestion.split('\n').map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </form>
  );
};

export default InputForm;
