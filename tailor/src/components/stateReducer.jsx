export const initialState = {
  customers: [],
  currentCustomer: null,
  measurementHistory: {},
  collar: {}, // Store collar details
  patti: {}, // Store پٹی details
  cuff: {}, // Store کف details
  pocket: {
    images: {
      pocketImage: '', // Main pocket selection
      sideJaibImage: '' // Side pocket selection
    },
    dropdowns: [
      { heading: 'فرنٹ جیب', value: '' },
      { heading: 'جیب سائز', value: '' },
      { heading: 'کندھے سے جیب', value: '' }
    ],
    styleSelections: [] // Selected style buttons
  },
  کٹر: { selectedButtons: [] } // Store کٹر details, initialized with empty array
};

export function stateReducer(state, action) {
  switch (action.type) {
    case "UPDATE_COLLAR": {
      const newCollar = { ...state.collar, ...action.payload };
      if (JSON.stringify(newCollar) === JSON.stringify(state.collar)) {
        console.log("UPDATE_COLLAR: No change, skipping update");
        return state;
      }
      return {
        ...state,
        collar: newCollar,
      };
    }
    case "UPDATE_PATTI": {
      const newPatti = { ...state.patti, ...action.payload };
      if (JSON.stringify(newPatti) === JSON.stringify(state.patti)) {
        console.log("UPDATE_PATTI: No change, skipping update");
        return state;
      }
      return {
        ...state,
        patti: newPatti,
      };
    }
    case "UPDATE_CUFF": {
      const newCuff = { ...state.cuff, ...action.payload };
      if (JSON.stringify(newCuff) === JSON.stringify(state.cuff)) {
        console.log("UPDATE_CUFF: No change, skipping update");
        return state;
      }
      return {
        ...state,
        cuff: newCuff,
      };
    }
    case "UPDATE_POCKET": {
      const newPocket = {
        ...state.pocket,
        images: { ...state.pocket.images, ...(action.payload.images || {}) },
        dropdowns: action.payload.dropdowns
          ? state.pocket.dropdowns.map((item, index) => ({
              ...item,
              value: action.payload.dropdowns[index]?.value || item.value,
            }))
          : state.pocket.dropdowns,
        styleSelections: action.payload.styleSelections
          ? action.payload.styleSelections
          : state.pocket.styleSelections,
      };
      if (JSON.stringify(newPocket) === JSON.stringify(state.pocket)) {
        console.log("UPDATE_POCKET: No change, skipping update");
        return state;
      }
      return {
        ...state,
        pocket: newPocket,
      };
    }
    case "UPDATE_کٹر": {
      const newCutter = {
        ...state.کٹر,
        selectedButtons: action.payload.selectedButtons || state.کٹر.selectedButtons || []
      };
      if (JSON.stringify(newCutter) === JSON.stringify(state.کٹر)) {
        console.log("UPDATE_کٹر: No change, skipping update");
        return state;
      }
      return {
        ...state,
        کٹر: newCutter,
      };
    }
    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
}