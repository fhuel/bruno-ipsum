import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

function IndexPopup() {
  // const [apiKey] = useStorage("hailing")

  const [apiKey, setApiKey, { setRenderValue, setStoreValue, remove }] =
    useStorage("apiKey")
  const [data, setData] = useState("")
  const [output, setOutput] = useState("s")

  const saveAPIKey = () => {
    // Encode String
    // const encodedValue = encode(data)
    setStoreValue()
    setOutput("Saved API Key: " + apiKey)
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>Extension!</h2>
      {!apiKey ? (
        <div>
          <p>To get started, add your OpenAI API Key!</p>
          <input onChange={(e) => setData(e.target.value)} value={apiKey} />
          <button id="save_key_button" onClick={() => setApiKey(data)}>
            Add key
          </button>
        </div>
      ) : (
        <div id="key_entered">
          <p>You entered your OpenAI API Key.</p>
          <button id="change_key_button" onClick={() => remove()}>
            Change key
          </button>
        </div>
      )}
      {output}aa : {apiKey}
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
