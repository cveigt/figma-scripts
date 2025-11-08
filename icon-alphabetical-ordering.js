// Figma script to reorder instances alphabetically by name
// Copy and paste this script directly into the Figma console
// Select the instances you want to reorder, then run this script

(() => {
  // Get selected nodes - access directly without storing in intermediate variable
  const page = figma.currentPage;
  const selection = page.selection;

  if (selection.length === 0) {
    console.log("Please select one or more instances to reorder.");
    return;
  }

  // Group selected nodes by their parent
  const nodesByParent = new Map();

  selection.forEach((node) => {
    if (!node.parent) {
      return;
    }

    const parent = node.parent;
    if (!nodesByParent.has(parent)) {
      nodesByParent.set(parent, []);
    }
    nodesByParent.get(parent).push(node);
  });

  // Process each parent group
  nodesByParent.forEach((nodes, parent) => {
    // Get all children of the parent (snapshot of current order)
    const allChildren = [...parent.children];

    // Track which children are selected
    const selectedSet = new Set(nodes);

    // Sort selected children alphabetically by name (case-insensitive)
    const sortedSelected = [...nodes].sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    // Build the final order: non-selected items stay in place,
    // sorted selected items replace their original positions
    const finalOrder = [];
    let sortedIndex = 0;

    for (let i = 0; i < allChildren.length; i++) {
      if (selectedSet.has(allChildren[i])) {
        // Replace with sorted version
        if (sortedIndex === 0) {
          finalOrder.push(...sortedSelected);
        }
        sortedIndex++;
      } else {
        // Keep non-selected items in their original positions
        finalOrder.push(allChildren[i]);
      }
    }

    // Reorder: appendChild moves nodes, so we work backwards
    // to maintain the correct order in the final result
    for (let i = finalOrder.length - 1; i >= 0; i--) {
      parent.appendChild(finalOrder[i]);
    }
  });

  console.log(`✓ Reordered ${selection.length} instance(s) alphabetically.`);
})();
