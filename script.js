/**
 * @license
 * TaskFlow — Modern SaaS-style Task Management Client
 * SPDX-License-Identifier: Apache-2.0
 */

/* ==========================================================================
   APPLICATION CONFIGURATION & STATE
   ========================================================================== */
const SEED_TASKS = [
  {
    id: "task-1",
    title: "Design TaskFlow SaaS Layout",
    description: "Review modern design trends on Dribbble, setup custom CSS variables for light/dark modes, and create sleek glassmorphic controls.",
    dueDate: getRelativeDateStr(0), // Today
    priority: "high",
    category: "Work",
    completed: true,
    important: true
  },
  {
    id: "task-2",
    title: "Plan weekly team alignment meeting",
    description: "Prepare the slides, update the project status dashboard, and compile feedback on current development sprint targets.",
    dueDate: getRelativeDateStr(1), // Tomorrow
    priority: "medium",
    category: "Work",
    completed: false,
    important: false
  },
  {
    id: "task-3",
    title: "Stock up on organic green vegetables",
    description: "Buy spinach, broccoli, celery, avocados, Greek yogurt, and meal prep proteins for the upcoming week.",
    dueDate: getRelativeDateStr(-1), // Overdue
    priority: "medium",
    category: "Shopping",
    completed: false,
    important: false
  },
  {
    id: "task-4",
    title: "Cardio and mobility stretching session",
    description: "45 minutes high-intensity interval training at the local athletic center followed by cool-down stretching routines.",
    dueDate: getRelativeDateStr(3), // In 3 days
    priority: "low",
    category: "Health",
    completed: false,
    important: true
  }
];

// Core Application State
let state = {
  tasks: [],
  filters: {
    sidebarTab: "all", // 'all' | 'today' | 'important' | 'completed' | 'pending'
    category: "all",    // 'all' | 'Work' | 'Personal' | 'Shopping' | 'Health'
    searchQuery: "",
    sortBy: "date"      // 'date' | 'alphabetical' | 'priority'
  },
  editingTaskId: null,
  deletingTaskId: null
};

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
function getRelativeDateStr(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "No due date";
  const dateObj = new Date(dateStr + 'T00:00:00');
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getPriorityWeight(priority) {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
}

/* ==========================================================================
   INITIALIZATION & PERSISTENCE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLoader();
  loadData();
  initGreeting();
  initSidebarMobile();
  initCustomSelects();
  initCharacterLimitCounters();
  initFiltersAndSorters();
  initFormControls();
  initDeleteModal();
  
  // Initial Display
  renderApp();
});

// Load from LocalStorage
function loadData() {
  const cachedTasks = localStorage.getItem("taskflow_tasks");
  if (cachedTasks) {
    try {
      state.tasks = JSON.parse(cachedTasks);
    } catch (e) {
      console.error("Failed to parse cached tasks", e);
      state.tasks = [...SEED_TASKS];
    }
  } else {
    // Seed default tasks on very first load
    state.tasks = [...SEED_TASKS];
    saveData();
  }
}

// Save to LocalStorage
function saveData() {
  localStorage.setItem("taskflow_tasks", JSON.stringify(state.tasks));
}

// Simulated App Loader Overlay
function initLoader() {
  const loader = document.getElementById("loading-screen");
  setTimeout(() => {
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => loader.style.display = "none", 500);
    }
  }, 1000);
}

// Theme management (Light / Dark Mode Toggle)
function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  
  // Get system preference or storage cache
  const cachedTheme = localStorage.getItem("taskflow_theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const activeTheme = cachedTheme || (systemPrefersDark ? "dark" : "light");
  htmlElement.setAttribute("data-theme", activeTheme);
  
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("taskflow_theme", newTheme);
    
    // Smooth toast alert on theme shift
    showToast(`Switched to ${newTheme} mode`, "warning");
  });
}

// Greeting Header Controller
function initGreeting() {
  const greetingTitle = document.getElementById("greeting-title");
  const currentDateText = document.getElementById("current-date-text");
  
  // Greeting based on real hour bounds
  const currentHour = new Date().getHours();
  let greetWord = "Hello";
  if (currentHour < 12) {
    greetWord = "Good morning";
  } else if (currentHour < 17) {
    greetWord = "Good afternoon";
  } else {
    greetWord = "Good evening";
  }
  
  greetingTitle.textContent = `${greetWord}, Aditi`;
  
  // Formatted Localized Calendar Date
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  currentDateText.textContent = new Date().toLocaleDateString('en-US', options);
}

/* ==========================================================================
   RESPONSIVE NAVIGATION (SIDEBAR)
   ========================================================================== */
function initSidebarMobile() {
  const sidebar = document.getElementById("app-sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");
  const overlay = document.getElementById("sidebar-overlay");
  
  function openSidebar() {
    sidebar.classList.add("sidebar-open");
    overlay.classList.add("visible");
  }
  
  function closeSidebar() {
    sidebar.classList.remove("sidebar-open");
    overlay.classList.remove("visible");
  }
  
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
  
  overlay.addEventListener("click", closeSidebar);
  
  // Close sidebar drawer if a menu item is clicked in mobile layout
  const menuLinks = sidebar.querySelectorAll(".menu-item, .category-item");
  menuLinks.forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });
  
  // Responsive resize cleanup
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeSidebar();
    }
  });
}

/* ==========================================================================
   CUSTOM DROP-DOWN SELECT ELEMENT WRAPPERS
   ========================================================================== */
function initCustomSelects() {
  const customSelects = document.querySelectorAll(".custom-select-wrapper");
  
  customSelects.forEach(wrapper => {
    const trigger = wrapper.querySelector(".custom-select-trigger");
    const optionsContainer = wrapper.querySelector(".custom-options");
    const options = wrapper.querySelectorAll(".custom-option");
    const nativeSelect = wrapper.querySelector("select");
    
    // Toggle dropdown open state
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close other dropdowns first
      customSelects.forEach(other => {
        if (other !== wrapper) other.classList.remove("open");
      });
      wrapper.classList.toggle("open");
    });
    
    // Listen to option select
    options.forEach(option => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Remove previous selected class
        options.forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");
        
        // Extract selected value
        const val = option.getAttribute("data-value");
        
        // Sync trigger display element
        const triggerSpan = trigger.querySelector("span");
        triggerSpan.innerHTML = option.innerHTML;
        
        // Sync actual hidden native select element
        if (nativeSelect) {
          nativeSelect.value = val;
          // Dispatch change event to trigger query updates
          nativeSelect.dispatchEvent(new Event("change"));
        }
        
        wrapper.classList.remove("open");
      });
    });
  });
  
  // Global click outside to collapse all custom dropdown triggers
  window.addEventListener("click", () => {
    customSelects.forEach(wrapper => wrapper.classList.remove("open"));
  });
}

// Function to force update custom dropdown styling programmatically (used in reset/edits)
function updateCustomDropdownValue(wrapperId, val) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  
  const options = wrapper.querySelectorAll(".custom-option");
  const triggerSpan = wrapper.querySelector(".custom-select-trigger span");
  const nativeSelect = wrapper.querySelector("select");
  
  options.forEach(opt => {
    if (opt.getAttribute("data-value") === val) {
      opt.classList.add("selected");
      if (triggerSpan) triggerSpan.innerHTML = opt.innerHTML;
    } else {
      opt.classList.remove("selected");
    }
  });
  
  if (nativeSelect) {
    nativeSelect.value = val;
  }
}

/* ==========================================================================
   INPUTS FIELD CHARACTER LEVEL TRACKERS
   ========================================================================== */
function initCharacterLimitCounters() {
  const titleInput = document.getElementById("task-title");
  const titleCounter = document.getElementById("title-char-counter");
  const descInput = document.getElementById("task-desc");
  const descCounter = document.getElementById("desc-char-counter");
  
  function updateCounter(input, counter, max) {
    const len = input.value.length;
    counter.textContent = `${len} / ${max}`;
    if (len >= max) {
      counter.style.color = "var(--danger-color)";
    } else if (len >= max * 0.8) {
      counter.style.color = "var(--warning-color)";
    } else {
      counter.style.color = "var(--text-muted)";
    }
  }
  
  titleInput.addEventListener("input", () => {
    updateCounter(titleInput, titleCounter, 50);
    // Clear validation error during active typing
    if (titleInput.value.trim() !== "") {
      titleInput.classList.remove("input-invalid");
      document.getElementById("title-error").style.display = "none";
    }
  });
  
  descInput.addEventListener("input", () => {
    updateCounter(descInput, descCounter, 200);
  });
}

/* ==========================================================================
   FILTER & SORT QUERY DISPATCHERS
   ========================================================================== */
function initFiltersAndSorters() {
  // 1. Sidebar Tabs Filter Clickers
  const sidebarMenuItems = document.querySelectorAll(".sidebar-menu .menu-item");
  sidebarMenuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Toggle visual active state
      sidebarMenuItems.forEach(mi => mi.classList.remove("active"));
      item.classList.add("active");
      
      // Update filter query state
      state.filters.sidebarTab = item.getAttribute("data-filter");
      
      // Reset sidebar category filters back to all
      const categoryItems = document.querySelectorAll(".category-list .category-item");
      categoryItems.forEach(ci => ci.classList.remove("active"));
      state.filters.category = "all";
      updateCustomDropdownValue("filter-category-select", "all");
      
      renderApp();
    });
  });

  // 2. Sidebar Tag List Clickers
  const categoryItems = document.querySelectorAll(".category-list .category-item");
  categoryItems.forEach(item => {
    item.addEventListener("click", () => {
      // Toggle active design classes
      categoryItems.forEach(ci => ci.classList.remove("active"));
      item.classList.add("active");
      
      // Reset sidebar menu item tabs back to all
      sidebarMenuItems.forEach(mi => mi.classList.remove("active"));
      document.querySelector('[data-filter="all"]').classList.add("active");
      
      // Update filters state
      state.filters.sidebarTab = "all";
      const catVal = item.getAttribute("data-category");
      state.filters.category = catVal;
      
      // Keep main toolbar dropdown synchronized
      updateCustomDropdownValue("filter-category-select", catVal);
      
      renderApp();
    });
  });

  // 3. Search Bar Listener
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  
  searchInput.addEventListener("input", () => {
    const val = searchInput.value.trim();
    state.filters.searchQuery = val;
    
    // Toggle close button
    searchClear.style.display = val.length > 0 ? "flex" : "none";
    
    renderApp();
  });
  
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    state.filters.searchQuery = "";
    searchClear.style.display = "none";
    searchInput.focus();
    renderApp();
  });

  // 4. Custom Select Toolbar (Category Filter change)
  const filterCategorySelect = document.getElementById("filter-category");
  filterCategorySelect.addEventListener("change", () => {
    const val = filterCategorySelect.value;
    state.filters.category = val;
    
    // Sync sidebar tags select
    categoryItems.forEach(ci => {
      if (ci.getAttribute("data-category") === val) {
        ci.classList.add("active");
      } else {
        ci.classList.remove("active");
      }
    });
    
    if (val === "all") {
      categoryItems.forEach(ci => ci.classList.remove("active"));
    }
    
    renderApp();
  });

  // 5. Custom Select Toolbar (Sort change)
  const sortBySelect = document.getElementById("sort-by");
  sortBySelect.addEventListener("change", () => {
    state.filters.sortBy = sortBySelect.value;
    renderApp();
  });
}

/* ==========================================================================
   TASK CREATION & EDIT SUBMISSION FORM HANDLER
   ========================================================================== */
function initFormControls() {
  const form = document.getElementById("task-form");
  const cancelBtn = document.getElementById("form-cancel-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  
  const floatingAddBtn = document.getElementById("floating-add-btn");
  const formModalContainer = document.getElementById("task-form-container-column");
  
  // Submit Action (Create / Update)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveFormTask();
    }
  });
  
  // Cancel / Clear Form Action
  cancelBtn.addEventListener("click", () => {
    resetFormState();
  });
  
  // Close responsive modal/drawer
  closeBtn.addEventListener("click", () => {
    collapseFormModal();
  });
  
  // FAB Button on mobile to trigger Modal open
  floatingAddBtn.addEventListener("click", () => {
    formModalContainer.classList.add("open-modal");
  });
  
  // Close on outer overlay container click in tablet mode
  formModalContainer.addEventListener("click", (e) => {
    if (e.target === formModalContainer) {
      collapseFormModal();
    }
  });
}

// Reset form fields and character tracking counts back to default
function resetFormState() {
  const form = document.getElementById("task-form");
  const titleInput = document.getElementById("task-title");
  const titleCounter = document.getElementById("title-char-counter");
  const descCounter = document.getElementById("desc-char-counter");
  const formHeading = document.getElementById("form-heading");
  const submitBtn = document.getElementById("form-submit-btn");
  
  form.reset();
  state.editingTaskId = null;
  
  // Revert UI titles back to Create mode
  formHeading.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Create New Task`;
  submitBtn.textContent = "Add Task";
  
  // Reset custom selects dropdown states to defaults
  updateCustomDropdownValue("task-priority-wrapper", "medium");
  updateCustomDropdownValue("task-category-wrapper", "Personal");
  
  // Reset characters trackers
  titleCounter.textContent = "0 / 50";
  titleCounter.style.color = "var(--text-muted)";
  descCounter.textContent = "0 / 200";
  descCounter.style.color = "var(--text-muted)";
  
  // Clear any active invalid input styles
  titleInput.classList.remove("input-invalid");
  document.getElementById("title-error").style.display = "none";
}

// Closes mobile form dialog
function collapseFormModal() {
  const formModalContainer = document.getElementById("task-form-container-column");
  formModalContainer.classList.remove("open-modal");
  resetFormState();
}

// Form Inline validation criteria
function validateForm() {
  const titleInput = document.getElementById("task-title");
  const titleError = document.getElementById("title-error");
  const titleVal = titleInput.value.trim();
  
  if (titleVal === "") {
    titleInput.classList.add("input-invalid");
    titleError.style.display = "block";
    titleInput.focus();
    return false;
  }
  
  titleInput.classList.remove("input-invalid");
  titleError.style.display = "none";
  return true;
}

// Save active task to database array
function saveFormTask() {
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();
  const dueDate = document.getElementById("task-due-date").value;
  const priority = document.getElementById("task-priority").value;
  const category = document.getElementById("task-category").value;
  
  if (state.editingTaskId) {
    // UPDATE MODE
    const index = state.tasks.findIndex(t => t.id === state.editingTaskId);
    if (index !== -1) {
      state.tasks[index] = {
        ...state.tasks[index],
        title,
        description,
        dueDate,
        priority,
        category
      };
      showToast("Task updated successfully", "success");
    }
  } else {
    // CREATE MODE
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      dueDate,
      priority,
      category,
      completed: false,
      important: false
    };
    state.tasks.unshift(newTask);
    showToast("Task added successfully", "success");
  }
  
  saveData();
  collapseFormModal(); // closes mobile and resets form
  renderApp();
}

/* ==========================================================================
   DELETE CONFIRMATION MODAL ACTIONS
   ========================================================================== */
function initDeleteModal() {
  const modal = document.getElementById("delete-modal");
  const cancelBtn = document.getElementById("delete-cancel-btn");
  const confirmBtn = document.getElementById("delete-confirm-btn");
  const backdrop = document.getElementById("delete-modal-backdrop");
  
  function closeModal() {
    modal.classList.remove("open");
    state.deletingTaskId = null;
  }
  
  cancelBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  
  confirmBtn.addEventListener("click", () => {
    const taskId = state.deletingTaskId;
    if (taskId) {
      // Find DOM element card
      const card = document.querySelector(`[data-id="${taskId}"]`);
      if (card) {
        // Trigger smooth CSS slide-out transition
        card.classList.add("slide-out");
        
        // Wait for anim to finish, then delete
        setTimeout(() => {
          state.tasks = state.tasks.filter(t => t.id !== taskId);
          saveData();
          closeModal();
          showToast("Task deleted successfully", "danger");
          renderApp();
        }, 350);
      } else {
        // Fallback delete if element not found
        state.tasks = state.tasks.filter(t => t.id !== taskId);
        saveData();
        closeModal();
        showToast("Task deleted successfully", "danger");
        renderApp();
      }
    }
  });
}

function promptDeleteModal(taskId, taskTitle) {
  state.deletingTaskId = taskId;
  
  // Set task name inside the confirmation prompt
  const namePlaceholder = document.getElementById("delete-task-title-placeholder");
  namePlaceholder.textContent = `"${taskTitle}"`;
  
  // Show modal wrapper
  const modal = document.getElementById("delete-modal");
  modal.classList.add("open");
}

/* ==========================================================================
   TASK CARDS RENDER ENGINE
   ========================================================================== */
function renderApp() {
  renderCounters();
  renderTaskList();
}

// 1. Calculate live stats counters and populate badges
function renderCounters() {
  const todayStr = getRelativeDateStr(0);
  
  let allCount = 0;
  let todayCount = 0;
  let importantCount = 0;
  let completedCount = 0;
  let pendingCount = 0;
  let dueTodayCount = 0;
  
  let workCount = 0;
  let personalCount = 0;
  let shoppingCount = 0;
  let healthCount = 0;
  
  state.tasks.forEach(task => {
    allCount++;
    
    if (task.completed) {
      completedCount++;
    } else {
      pendingCount++;
      // Counts overdue or due today as active issues
      if (task.dueDate === todayStr) {
        dueTodayCount++;
      }
    }
    
    if (task.dueDate === todayStr) {
      todayCount++;
    }
    
    if (task.important) {
      importantCount++;
    }
    
    // Category Counts
    if (task.category === "Work") workCount++;
    else if (task.category === "Personal") personalCount++;
    else if (task.category === "Shopping") shoppingCount++;
    else if (task.category === "Health") healthCount++;
  });
  
  // Render Sidebar counters
  document.getElementById("count-all").textContent = allCount;
  document.getElementById("count-today").textContent = todayCount;
  document.getElementById("count-important").textContent = importantCount;
  document.getElementById("count-completed").textContent = completedCount;
  document.getElementById("count-pending").textContent = pendingCount;
  
  // Category specific sidebar tags
  document.getElementById("cat-work-count").textContent = workCount;
  document.getElementById("cat-personal-count").textContent = personalCount;
  document.getElementById("cat-shopping-count").textContent = shoppingCount;
  document.getElementById("cat-health-count").textContent = healthCount;
  
  // Workspace banner counters
  document.getElementById("count-due-today").textContent = dueTodayCount;
  document.getElementById("count-done").textContent = completedCount;
  
  // Weekly Stats calculation
  const statsPct = document.getElementById("completion-percentage");
  const statsBarFill = document.getElementById("progress-bar-fill");
  const statsSummaryText = document.getElementById("stats-summary-text");
  
  const completionRatio = allCount > 0 ? Math.round((completedCount / allCount) * 100) : 0;
  
  statsPct.textContent = `${completionRatio}%`;
  statsBarFill.style.width = `${completionRatio}%`;
  statsSummaryText.textContent = `${completedCount} of ${allCount} tasks completed`;
}

// 2. Fetch and render filtered tasks list onto DOM
function renderTaskList() {
  const container = document.getElementById("tasks-list-container");
  const emptyState = document.getElementById("empty-state-card");
  const listMetaTitle = document.getElementById("list-meta-title");
  const activeListCount = document.getElementById("active-list-count");
  
  // Clear layout contents
  container.innerHTML = "";
  
  const todayStr = getRelativeDateStr(0);
  
  // Filter core state list
  let filtered = state.tasks.filter(task => {
    // A. Filter by Tab
    if (state.filters.sidebarTab === "today") {
      return task.dueDate === todayStr;
    } else if (state.filters.sidebarTab === "important") {
      return task.important;
    } else if (state.filters.sidebarTab === "completed") {
      return task.completed;
    } else if (state.filters.sidebarTab === "pending") {
      return !task.completed;
    }
    return true; // All Tab
  });
  
  // B. Filter by Category
  if (state.filters.category !== "all") {
    filtered = filtered.filter(task => task.category === state.filters.category);
  }
  
  // C. Filter by Search Box (Title / Desc)
  if (state.filters.searchQuery !== "") {
    const query = state.filters.searchQuery.toLowerCase();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    );
  }
  
  // D. Sort list
  filtered.sort((a, b) => {
    if (state.filters.sortBy === "date") {
      // Empty dates should float to bottom
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");
      return dateA - dateB;
    } else if (state.filters.sortBy === "alphabetical") {
      return a.title.localeCompare(b.title);
    } else if (state.filters.sortBy === "priority") {
      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    }
    return 0;
  });
  
  // Meta title changes depending on filters
  let listHeading = "All Active Tasks";
  if (state.filters.sidebarTab === "today") listHeading = "Tasks Due Today";
  else if (state.filters.sidebarTab === "important") listHeading = "Important Tasks";
  else if (state.filters.sidebarTab === "completed") listHeading = "Completed Workspace";
  else if (state.filters.sidebarTab === "pending") listHeading = "Pending Deadlines";
  
  if (state.filters.category !== "all") {
    listHeading += ` (${state.filters.category})`;
  }
  
  listMetaTitle.textContent = listHeading;
  activeListCount.textContent = `Showing ${filtered.length} tasks`;
  
  // Handle empty state displays
  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    container.classList.add("hidden");
    
    // Bind click trigger onto empty state button to launch modal
    const emptyBtn = document.getElementById("empty-state-btn");
    emptyBtn.onclick = () => {
      if (window.innerWidth < 1200) {
        document.getElementById("task-form-container-column").classList.add("open-modal");
      } else {
        document.getElementById("task-title").focus();
      }
    };
    return;
  }
  
  emptyState.classList.add("hidden");
  container.classList.remove("hidden");
  
  // Render cards individually
  filtered.forEach(task => {
    const card = createTaskCardDOM(task);
    container.appendChild(card);
  });
}

// 3. Build Card Element and attach dynamic listener triggers
function createTaskCardDOM(task) {
  const todayStr = getRelativeDateStr(0);
  const isOverdue = task.dueDate && task.dueDate < todayStr && !task.completed;
  
  const card = document.createElement("div");
  card.className = `task-card card priority-${task.priority}`;
  if (task.completed) card.classList.add("completed");
  card.setAttribute("data-id", task.id);
  
  // HTML layout skeleton
  card.innerHTML = `
    <div class="task-primary-row">
      <!-- Checkbox column -->
      <label class="checkbox-container" aria-label="Mark task ${task.completed ? 'pending' : 'complete'}">
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span class="custom-checkbox"></span>
      </label>
      
      <!-- Core Info Column -->
      <div class="task-info">
        <div class="task-title-row">
          <h3 class="task-title">${escapeHTML(task.title)}</h3>
          
          <!-- Actions Control buttons -->
          <div class="task-actions">
            <!-- Favorite button -->
            <button class="action-btn fav-btn ${task.important ? 'active' : ''}" aria-label="${task.important ? 'Remove from favorites' : 'Mark as favorite'}">
              <i class="fa-${task.important ? 'solid' : 'regular'} fa-star"></i>
            </button>
            
            <!-- Edit button -->
            <button class="action-btn edit-btn" aria-label="Edit task">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            
            <!-- Delete button -->
            <button class="action-btn delete-btn" aria-label="Delete task">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            
            <!-- Expand drawer chevron button -->
            <button class="action-btn expand-btn" aria-label="Toggle details">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>
        
        <!-- Description segment (only if filled) -->
        ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}
        
        <!-- Badges segment -->
        <div class="task-badges-row">
          <span class="badge-priority badge-priority-${task.priority}">${task.priority} Priority</span>
          <span class="badge-category badge-category-${task.category.toLowerCase()}">
            <span class="dot dot-${task.category.toLowerCase()}"></span>
            ${task.category}
          </span>
          
          <!-- Due date meta -->
          ${task.dueDate ? `
            <span class="task-due-date-meta ${isOverdue ? 'overdue' : ''}">
              <i class="fa-regular fa-calendar"></i>
              <span>${isOverdue ? 'Overdue: ' : ''}${formatDateDisplay(task.dueDate)}</span>
            </span>
          ` : ''}
        </div>
        
        <!-- Collapsible Details Expansion Drawer -->
        <div class="task-details-drawer" id="drawer-${task.id}">
          <div class="drawer-meta-grid">
            <div class="drawer-meta-item">
              <i class="fa-solid fa-id-card"></i>
              <span><strong>ID:</strong> ${task.id}</span>
            </div>
            <div class="drawer-meta-item">
              <i class="fa-solid fa-circle-info"></i>
              <span><strong>Status:</strong> ${task.completed ? 'Completed' : 'Active Pending'}</span>
            </div>
            <div class="drawer-meta-item">
              <i class="fa-solid fa-folder"></i>
              <span><strong>Category:</strong> ${task.category}</span>
            </div>
            <div class="drawer-meta-item">
              <i class="fa-solid fa-business-time"></i>
              <span><strong>Urgency:</strong> ${task.priority.toUpperCase()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
  
  // Attach Event Listeners onto Card buttons
  
  // A. Checkbox click toggling
  const checkbox = card.querySelector(".checkbox-container input");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveData();
    
    if (task.completed) {
      card.classList.add("completed");
      showToast("Task completed!", "success");
    } else {
      card.classList.remove("completed");
      showToast("Task marked as pending", "warning");
    }
    
    renderCounters();
    // Delay full list re-rendering slightly to allow check animation to complete smoothly
    setTimeout(() => {
      renderTaskList();
    }, 400);
  });
  
  // B. Toggle star favorite status
  const favBtn = card.querySelector(".fav-btn");
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    task.important = !task.important;
    saveData();
    
    const icon = favBtn.querySelector("i");
    if (task.important) {
      favBtn.classList.add("active");
      icon.className = "fa-solid fa-star";
      showToast("Added to favorites", "success");
    } else {
      favBtn.classList.remove("active");
      icon.className = "fa-regular fa-star";
      showToast("Removed from favorites", "warning");
    }
    renderCounters();
    
    // If we're on the important tab, filter changes immediately
    if (state.filters.sidebarTab === "important") {
      setTimeout(() => renderTaskList(), 300);
    }
  });
  
  // C. Edit details clicker
  const editBtn = card.querySelector(".edit-btn");
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    loadTaskToEdit(task);
  });
  
  // D. Delete card clicker
  const deleteBtn = card.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    promptDeleteModal(task.id, task.title);
  });
  
  // E. Toggle Details drawer expand collapse
  const expandBtn = card.querySelector(".expand-btn");
  const drawer = card.querySelector(`.task-details-drawer`);
  expandBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    expandBtn.classList.toggle("rotated");
    const isVisible = expandBtn.classList.contains("rotated");
    drawer.style.display = isVisible ? "flex" : "none";
  });
  
  return card;
}

// Escapes special HTML characters to prevent XSS issues
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   EDIT TASK LOADER CONTROL
   ========================================================================== */
function loadTaskToEdit(task) {
  state.editingTaskId = task.id;
  
  // Fill inputs fields
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const dateInput = document.getElementById("task-due-date");
  
  titleInput.value = task.title;
  descInput.value = task.description || "";
  dateInput.value = task.dueDate || "";
  
  // Fill custom selects wrappers
  updateCustomDropdownValue("task-priority-wrapper", task.priority);
  updateCustomDropdownValue("task-category-wrapper", task.category);
  
  // Update char lengths indicators
  document.getElementById("title-char-counter").textContent = `${task.title.length} / 50`;
  document.getElementById("desc-char-counter").textContent = `${(task.description || "").length} / 200`;
  
  // Re-title form headings
  document.getElementById("form-heading").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Update Task Details`;
  document.getElementById("form-submit-btn").textContent = "Save Changes";
  
  // Scroll to Form on desktop or open Modal drawer in Mobile views
  if (window.innerWidth < 1200) {
    document.getElementById("task-form-container-column").classList.add("open-modal");
  } else {
    document.getElementById("task-input-card").scrollIntoView({ behavior: "smooth", block: "center" });
    titleInput.focus();
  }
  
  showToast("Loaded task for editing", "warning");
}

/* ==========================================================================
   STACKABLE TOAST ALERTS NOTIFICATIONS MANAGER
   ========================================================================== */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  // Create single toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  // Icon selector
  let iconClass = "fa-solid fa-circle-check";
  if (type === "danger") iconClass = "fa-solid fa-circle-xmark";
  else if (type === "warning") iconClass = "fa-solid fa-circle-exclamation";
  
  toast.innerHTML = `
    <span class="toast-icon"><i class="${iconClass}"></i></span>
    <span class="toast-message">${escapeHTML(message)}</span>
    <button class="toast-close-btn" aria-label="Dismiss alert">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  
  // Append to bottom stacking container
  container.appendChild(toast);
  
  function dismissToast() {
    toast.classList.add("toast-leave");
    // Wait for slide exit transition, then remove
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
  
  // Close trigger button
  toast.querySelector(".toast-close-btn").addEventListener("click", dismissToast);
  
  // Auto-dismiss timeout
  setTimeout(dismissToast, 3500);
}
