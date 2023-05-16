import { useState } from "react";

const InterviewQuestion = () => {
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [interestedRole, setInterestedRole] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/job_applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_application: {
          education,
          experience,
          interested_role: interestedRole,
          company_info: companyInfo,
        },
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);

        // 將提交的表單資料作為提示，並呼叫 OpenAI API
        return fetch("http://localhost:3000/generate_content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt:
              `教育程度：${education}\n` + // education
              `工作經驗：${experience}\n` + // experience
              `職務：${interestedRole}\n` + // interestedRole
              `公司資訊：${companyInfo}\n` + // companyInfo
              "\n"+
              "請根據以上資訊，撰寫一段約300字、口氣正式自信、且適合放在履歷表中的求職者用自我介紹。", // prompt
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        // 將生成的內容顯示在頁面上
        setGeneratedContent(data.generated_content);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Education:
        <input
          type="text"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />
      </label>
      <label>
        Experience:
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </label>
      <label>
        Interested Role:
        <input
          type="text"
          value={interestedRole}
          onChange={(e) => setInterestedRole(e.target.value)}
        />
      </label>
      <label>
        Company Information:
        <textarea
          value={companyInfo}
          onChange={(e) => setCompanyInfo(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
      <p>{generatedContent}</p>
    </form>
  );
}
 
export default InputForm;