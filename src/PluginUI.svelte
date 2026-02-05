<script>
  /**
   * Demo Plugin UI showcasing all standardized components and utilities
   */

  // UI components from figma-ui3-kit-svelte
  import {
    Button,
    Dropdown,
    Tabs,
    Text,
    Input,
    IconButton,
    IconMore,
  } from "figma-ui3-kit-svelte";

  // Components and utilities from figma-plugin-utils
  import {
    PluginLayout,
    Header,
    LoadingState,
    EmptyState,
    FieldGroup,
    Footer,
    StatusBar,
    ListItem,
    sendToPlugin,
    createMessageHandler,
    validateUrl,
    validateJsonString,
    sanitizeName,
    rgbToHex,
    hexToRgb,
  } from "figma-plugin-utils";

  // ============================================
  // State
  // ============================================
  let selectedTab = 0;
  let status = { message: "", type: "info" };

  // Tab configuration (Tabs component uses { label } format)
  const tabs = [
    { label: "Create" },
    { label: "List" },
    { label: "Validate" },
    { label: "Colors" },
  ];

  // ============================================
  // Create Tab State
  // ============================================
  let textInput = "Hello Figma!";
  const shapeOptions = [
    { label: "Rectangle", value: "rectangle" },
    { label: "Circle", value: "circle" },
  ];
  let selectedShape = shapeOptions[0];

  // ============================================
  // List Tab State
  // ============================================
  let items = [
    { id: "1", title: "First Item", meta: "Created today" },
    { id: "2", title: "Second Item", meta: "Created yesterday" },
    { id: "3", title: "Third Item", meta: "Last week" },
  ];
  let selectedItemId = null;
  const itemMenuOptions = [
    { label: "Duplicate", value: "duplicate" },
    { label: "Delete", value: "delete" },
  ];

  // ============================================
  // Validate Tab State
  // ============================================
  let urlInput = "";
  let urlValidation = { valid: true };
  let jsonInput = '{"name": "test"}';
  let jsonValidation = { valid: true };
  let nameInput = "My Plugin!!!";
  let sanitizedName = "";

  // ============================================
  // Colors Tab State
  // ============================================
  let hexInput = "#3B82F6";
  let rgbResult = null;
  let rInput = 0.23;
  let gInput = 0.51;
  let bInput = 0.96;
  let hexResult = "";

  // ============================================
  // Message Handler
  // ============================================
  window.onmessage = createMessageHandler({
    success: (msg) => {
      status = { message: msg.message || "Success!", type: "success" };
    },
    error: (msg) => {
      status = { message: msg.message || "An error occurred", type: "error" };
    },
  });

  // ============================================
  // Create Tab Actions
  // ============================================
  function createShape() {
    const shapeType = selectedShape?.value || "rectangle";
    sendToPlugin(shapeType === "circle" ? "create-circle" : "create-rectangle");
  }

  function createText() {
    sendToPlugin("create-text", { text: textInput });
  }

  // ============================================
  // List Tab Actions
  // ============================================
  function handleItemClick(e) {
    selectedItemId = e.detail.id;
    status = {
      message: `Selected: ${items.find((i) => i.id === e.detail.id)?.title}`,
      type: "info",
    };
  }

  function handleItemMenuSelect(e) {
    const { id, action } = e.detail;
    const item = items.find((i) => i.id === id);

    if (action === "duplicate") {
      const newItem = {
        id: Date.now().toString(),
        title: `${item.title} (copy)`,
        meta: "Just now",
      };
      items = [...items, newItem];
      status = { message: `Duplicated "${item.title}"`, type: "success" };
    } else if (action === "delete") {
      items = items.filter((i) => i.id !== id);
      if (selectedItemId === id) selectedItemId = null;
      status = { message: `Deleted "${item.title}"`, type: "warning" };
    }
  }

  function addItem() {
    const newItem = {
      id: Date.now().toString(),
      title: `Item ${items.length + 1}`,
      meta: "Just now",
    };
    items = [...items, newItem];
    status = { message: "Item added", type: "success" };
  }

  function clearItems() {
    items = [];
    selectedItemId = null;
  }

  // ============================================
  // Validate Tab Actions
  // ============================================
  function validateUrlInput() {
    urlValidation = validateUrl(urlInput);
    if (urlValidation.valid) {
      status = { message: "URL is valid!", type: "success" };
    } else {
      status = { message: urlValidation.error, type: "error" };
    }
  }

  function validateJsonInput() {
    jsonValidation = validateJsonString(jsonInput);
    if (jsonValidation.valid) {
      status = { message: "JSON is valid!", type: "success" };
    } else {
      status = { message: jsonValidation.error, type: "error" };
    }
  }

  function sanitizeNameInput() {
    sanitizedName = sanitizeName(nameInput);
    status = { message: `Sanitized: "${sanitizedName}"`, type: "info" };
  }

  // ============================================
  // Colors Tab Actions
  // ============================================
  function convertHexToRgb() {
    rgbResult = hexToRgb(hexInput);
    if (rgbResult) {
      status = {
        message: `RGB: ${rgbResult.r.toFixed(2)}, ${rgbResult.g.toFixed(2)}, ${rgbResult.b.toFixed(2)}`,
        type: "success",
      };
    } else {
      status = { message: "Invalid hex color", type: "error" };
    }
  }

  function convertRgbToHex() {
    hexResult = rgbToHex({ r: rInput, g: gInput, b: bInput });
    status = { message: `Hex: ${hexResult}`, type: "success" };
  }

  function clearStatus() {
    status = { message: "", type: "info" };
  }

  function showInfo() {
    status = { message: "figma-plugin-utils demo", type: "info" };
  }
</script>

<div class="plugin-container">
  <Header title="Plugin Utils Demo">
    <svelte:fragment slot="right">
      <IconButton iconName={IconMore} on:click={showInfo} />
    </svelte:fragment>
  </Header>

  <PluginLayout>
    <Tabs {tabs} bind:selectedTab />

    <div class="content">
      <!-- CREATE TAB (index 0) -->
      {#if selectedTab === 0}
        <div class="section">
          <Text variant="heading-small">Create Elements</Text>
          <Text variant="body-medium" color="secondary">
            Demonstrates sendToPlugin, createMessageHandler
          </Text>

          <FieldGroup label="Shape">
            <Dropdown
              placeholder="Select a shape"
              menuItems={shapeOptions}
              bind:value={selectedShape}
            />
          </FieldGroup>

          <FieldGroup label="Text content">
            <Input bind:value={textInput} placeholder="Enter text..." />
          </FieldGroup>

          <div class="button-row">
            <Button variant="secondary" on:click={createShape}
              >Create shape</Button
            >
            <Button variant="secondary" on:click={createText}
              >Create text</Button
            >
          </div>
        </div>

        <!-- LIST TAB (index 1) -->
      {:else if selectedTab === 1}
        <div class="section">
          <Text variant="heading-small">List Items</Text>
          <Text variant="body-medium" color="secondary">
            Demonstrates ListItem, EmptyState components
          </Text>
        </div>

        {#if items.length === 0}
          <EmptyState
            message="No items yet"
            action={{ label: "Add Item", handler: addItem }}
          />
        {:else}
          <div class="list">
            {#each items as item (item.id)}
              <ListItem
                id={item.id}
                title={item.title}
                active={selectedItemId === item.id}
                menuItems={itemMenuOptions}
                on:click={handleItemClick}
                on:menuSelect={handleItemMenuSelect}
              >
                <span>{item.meta}</span>
              </ListItem>
            {/each}
          </div>
        {/if}

        <!-- VALIDATE TAB (index 2) -->
      {:else if selectedTab === 2}
        <div class="section">
          <Text variant="heading-small">Validation Utils</Text>
          <Text variant="body-medium" color="secondary">
            Demonstrates validation.js utilities
          </Text>

          <FieldGroup label="URL Validation">
            <Input bind:value={urlInput} placeholder="https://example.com" />
            <Button variant="secondary" on:click={validateUrlInput}
              >Validate URL</Button
            >
          </FieldGroup>

          <FieldGroup label="JSON Validation">
            <Input bind:value={jsonInput} placeholder="Enter JSON here..." />
            <Button variant="secondary" on:click={validateJsonInput}
              >Validate JSON</Button
            >
          </FieldGroup>

          <FieldGroup label="Name Sanitization">
            <Input
              bind:value={nameInput}
              placeholder="Enter name with special chars"
            />
            <Button variant="secondary" on:click={sanitizeNameInput}
              >Sanitize</Button
            >
            {#if sanitizedName}
              <Text variant="body-small" color="secondary"
                >Result: {sanitizedName}</Text
              >
            {/if}
          </FieldGroup>
        </div>

        <!-- COLORS TAB (index 3) -->
      {:else if selectedTab === 3}
        <div class="section">
          <Text variant="heading-small">Color Utils</Text>
          <Text variant="body-medium" color="secondary">
            Demonstrates colors.js utilities
          </Text>

          <FieldGroup label="Hex to RGB">
            <div class="color-row">
              <Input bind:value={hexInput} placeholder="#FF0000" />
              <div class="color-preview" style="background: {hexInput}"></div>
            </div>
            <Button variant="secondary" on:click={convertHexToRgb}
              >Convert to RGB</Button
            >
            {#if rgbResult}
              <Text variant="body-small" color="secondary">
                R: {rgbResult.r.toFixed(3)}, G: {rgbResult.g.toFixed(3)}, B: {rgbResult.b.toFixed(
                  3,
                )}
              </Text>
            {/if}
          </FieldGroup>

          <FieldGroup label="RGB to Hex (0-1 range)">
            <div class="rgb-inputs">
              <Input bind:value={rInput} placeholder="R" type="number" />
              <Input bind:value={gInput} placeholder="G" type="number" />
              <Input bind:value={bInput} placeholder="B" type="number" />
            </div>
            <Button variant="secondary" on:click={convertRgbToHex}
              >Convert to Hex</Button
            >
            {#if hexResult}
              <div class="color-row">
                <Text variant="body-small" color="secondary"
                  >Result: {hexResult}</Text
                >
                <div
                  class="color-preview"
                  style="background: {hexResult}"
                ></div>
              </div>
            {/if}
          </FieldGroup>
        </div>
      {/if}
    </div>
  </PluginLayout>

  <StatusBar
    message={status.message}
    type={status.type}
    on:close={clearStatus}
  />

  <Footer variant="split">
    <svelte:fragment slot="right">
      {#if selectedTab === 1 && items.length > 0}
        <Button variant="secondary" on:click={clearItems}>Clear all</Button>
        <Button variant="primary" on:click={addItem}>Add item</Button>
      {/if}
    </svelte:fragment>
  </Footer>
</div>

<style>
  .plugin-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--size-xsmall);
    padding-top: var(--size-xsmall);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--size-xxsmall);
  }

  .list {
    display: flex;
    flex-direction: column;
  }

  .button-row {
    display: flex;
    gap: var(--size-xxsmall);
    flex-wrap: wrap;
  }

  .color-row {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall);
  }

  .color-preview {
    width: 24px;
    height: 24px;
    border-radius: var(--border-radius-small);
    border: 1px solid var(--figma-color-border);
    flex-shrink: 0;
  }

  .rgb-inputs {
    display: flex;
    gap: var(--size-xxxsmall);
  }

  .rgb-inputs :global(input) {
    width: 60px;
  }
</style>
