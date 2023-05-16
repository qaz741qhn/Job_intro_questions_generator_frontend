import { useState } from "react";

const apiURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://remarkable-lokum-400dc6.netlify.app";

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
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedInterviewQuestion, setGeneratedInterviewQuestion] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();

    const body = {
      prompt:
        `教育程度：${education}\n` + // education
        `工作經驗：${experience}\n` + // experience
        `職務：${interestedRole}\n` + // interestedRole
        `公司資訊：${companyInfo}\n` + // companyInfo
        "\n" +
        "請根據以上資訊，撰寫一段約300字、口氣正式自信、且適合放在履歷表中的求職者用自我介紹。",
    };

    fetchAPI(`${apiURL}/job_applications/generate_content`, body).then((data) => {
      setGeneratedContent(data.generated_content);
    });
  };

  const generateInterviewQuestion = () => {
    const body = {
      prompt:
        `求職者教育程度：${education}\n` +
        `求職者工作經驗：${experience}\n` +
        `求職者應徵職務：${interestedRole}\n` +
        `求職者應徵公司資訊：${companyInfo}\n` +
        "\n" +
        "請根據以上資訊，設想五個面試官可能會在面試時詢問的中文問題。",
    };

    fetchAPI(`${apiURL}/job_applications/generate_interview_question`, body).then((data) => {
      setGeneratedInterviewQuestion(data.generated_interview_questions);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={education} onChange={(e) => setEducation(e.target.value)} label="Education" />
      <TextArea value={experience} onChange={(e) => setExperience(e.target.value)} label="Experience" />
      <Input value={interestedRole} onChange={(e) => setInterestedRole(e.target.value)} label="Interested Role" />
      <TextArea value={companyInfo} onChange={(e) => setCompanyInfo(e.target.value)} label="Company Information" />
      <button type="submit">Submit</button>
      <p>{generatedContent}</p>
      <button type="button" onClick={generateInterviewQuestion}>
        Generate Interview Question
      </button>
      <p>{generatedInterviewQuestion}</p>
    </form>
  );
};

export default InputForm;

