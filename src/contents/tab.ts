export {};

import { Storage } from "@plasmohq/storage";
import { v4 as uuidv4 } from "uuid";

const storage = new Storage({
  copiedKeyList: ["shield-modulation"],
});
const tabId = uuidv4();

console.log("Hello from content script");
console.log(window.location);
console.log(tabId);

type Project = { id: String; tabs: String[] };

async function onInit() {
  // debugger;
  let tabCount = Number.parseInt(await storage.get("tabCount"));
  tabCount = Number.isNaN(tabCount) ? 1 : tabCount++;
  await storage.set("tabCount", tabCount);

  if (!storage.get(tabId)) {
    await storage.set(`${tabId}`, {
      location: window.location,
    });
  }

  let projects: Project[] = await storage.get("projects");

  console.log(projects);
  if (!projects || projects.length === 0) {
    console.log("Add new Project");
    const projectId = uuidv4();
    projects = [{ id: projectId, tabs: [tabId] }];
    console.log(projects);
    await storage.set("projects", projects);
    await storage.set(`${tabId}`, {
      location: window.location,
      projectId: projectId,
    });
    await storage.set("currentProject", projectId);
  }

  // add to existing
  else if (projects) {
    let currentProject = await storage.get("currentProject");
    console.log(currentProject);

    if (currentProject === "d565ac91-a0e0-41be-9b87-2640ea4e1f06") {
      currentProject = projects[0].id;
    }
    //debugger;
    const index = projects.findIndex(
      (project) => project.id === currentProject
    );

    console.log(index);
    if (index != -1) {
      console.log("add tab to project");
      console.log(projects);
      projects[0].tabs = [...projects[0].tabs, tabId];
      console.log(projects);
      await storage.set("projects", projects);
    }
  }
}
onInit();

storage.watch({
  projects: (change) => console.log(change),
});

window.addEventListener("beforeunload", async () => {
  const pageReloaded = window.performance
    .getEntriesByType("navigation")
    .map((nav) => (nav as any).type)
    .includes("reload");

  if (!pageReloaded) {
    let tabCount = Number.parseInt(await storage.get("tabCount"));
    tabCount--;
    await storage.set("tabCount", tabCount);

    storage.remove(`${tabId}`);
  }
});
