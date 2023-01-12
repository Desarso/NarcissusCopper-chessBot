import { createSignal } from "solid-js";
import {dndzone} from "solid-dnd-directive";
import { For } from "solid-js";
const containerStyle = {border: "1px solid black", padding: "0.3em", "max-width": "200px"};
const itemStyle = {border: "1px solid blue", padding: "0.3em", margin: "0.2em 0"};

function Example() {
  const [items, setItems] = createSignal([
    {id: 1, title: "item 1"},
    {id: 2, title: "item 2"},
    {id: 3, title: "item 3"}
  ]);

  function handleDndEvent(e) {
     const {items: newItems} = e.detail;
     setItems(newItems);
  }
  return (
    <main>
         <section style={containerStyle} use:dndzone={{items}} on:consider={handleDndEvent} on:finalize={handleDndEvent}>
            <For each={items()}>{item => <div style={itemStyle}>{item.title}</div>}</For>
        </section>
    </main>
  );
}

export default Example;