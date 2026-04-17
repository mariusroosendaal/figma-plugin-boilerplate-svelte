<script>
  /**
   * Boilerplate demo UI — create shapes and text on the canvas
   */

  import {
    Button,
    Dropdown,
    Tabs,
    Text,
    Input,
    Slider,
    IconButton,
    IconMore,
  } from "figma-ui3-kit-svelte";

  import {
    PluginLayout,
    Header,
    FieldGroup,
    Footer,
    StatusBar,
    sendToPlugin,
    createMessageHandler,
  } from "figma-plugin-utils";

  let status = { message: "", type: "info" };
  let selectedTab = 0;

  const tabs = [
    { id: "shape", label: "Shape" },
    { id: "text", label: "Text" },
  ];

  let textInput = "Hello Figma!";
  const shapeOptions = [
    { label: "Rectangle", value: "rectangle" },
    { label: "Circle", value: "circle" },
  ];
  let selectedShape = shapeOptions[0];
  /** Number of shapes to create (1-5) */
  let shapeCount = 3;

  window.onmessage = createMessageHandler({
    success: (msg) => {
      status = { message: msg.message || "Success!", type: "success" };
    },
    error: (msg) => {
      status = { message: msg.message || "An error occurred", type: "error" };
    },
  });

  function createShape() {
    const shapeType = selectedShape?.value || "rectangle";
    sendToPlugin(
      shapeType === "circle" ? "create-circle" : "create-rectangle",
      {
        count: shapeCount,
      },
    );
  }

  function createText() {
    sendToPlugin("create-text", { text: textInput });
  }

  function clearStatus() {
    status = { message: "", type: "info" };
  }

  function showInfo() {
    status = { message: "Boilerplate demo — figma-plugin-utils", type: "info" };
  }
</script>

<div class="plugin-container">
  <StatusBar
    message={status.message}
    type={status.type}
    on:close={clearStatus}
  />
  <Header>
    <svelte:fragment slot="left">
      <Tabs {tabs} bind:selectedTab />
    </svelte:fragment>
    <svelte:fragment slot="right">
      <IconButton iconName={IconMore} on:click={showInfo} />
    </svelte:fragment>
  </Header>

  <PluginLayout>
    {#if selectedTab === 0}
      <div class="section">
        <Text variant="body-medium" color="secondary">
          Choose a shape, then create it on the canvas
        </Text>
        <FieldGroup label="Shape">
          <Dropdown
            placeholder="Select a shape"
            menuItems={shapeOptions}
            bind:value={selectedShape}
          />
        </FieldGroup>
        <FieldGroup label="Number of shapes">
          <Slider
            bind:value={shapeCount}
            min={1}
            max={5}
            step={1}
            variant="stepper"
          />
        </FieldGroup>
      </div>
    {:else}
      <div class="section">
        <Text variant="body-medium" color="secondary">
          Enter text, then add it to the canvas
        </Text>
        <FieldGroup label="Text content">
          <Input bind:value={textInput} placeholder="Enter text..." />
        </FieldGroup>
      </div>
    {/if}
  </PluginLayout>

  {#if selectedTab === 0}
    <Footer variant="right">
      <Button variant="primary" on:click={createShape}>Create shape</Button>
    </Footer>
  {:else}
    <Footer variant="right">
      <Button variant="primary" on:click={createText}>Create text</Button>
    </Footer>
  {/if}
</div>

<style>
  .plugin-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--size-xxsmall);
  }
</style>
