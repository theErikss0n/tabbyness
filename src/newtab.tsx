import { useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";

import "./style.css";

function IndexNewtab() {
  const [data, setData] = useState("");
  const [projects] = useStorage("projects");

  console.log(projects);

  return (
    <div
      className="new-tab"
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Projects</h1>
      {projects &&
        projects.map((project) => {
          return (
            <li key={project.id}>
              {project.id}
              <ul>
                {project.tabs.map((tab) => (
                  <li key={tab}>{tab}</li>
                ))}
              </ul>
            </li>
          );
        })}

      <input onChange={(e) => setData(e.target.value)} value={data} />
      <footer>Crafted by @theErikss0n</footer>
    </div>
  );
}

export default IndexNewtab;
