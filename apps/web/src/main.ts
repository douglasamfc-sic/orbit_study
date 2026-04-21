import "./app/styles/tokens.css"
import { mount } from "svelte"
import App from "./app/app.svelte"

const target = document.getElementById("app")
if (!target) throw new Error("Mount target #app not found in DOM")

const app = mount(App, { target })

export default app
