// Calendar Data
const studyPlan = {
    topics: [
        { name: "Hashing/Prefix-Sum/Suffix-Sum", count: 107, color: "#4361ee" },
        { name: "Dynamic Programming", count: 104, color: "#3a0ca3" },
        { name: "Greedy", count: 70, color: "#f72585" },
        { name: "Binary Search", count: 42, color: "#7209b7" },
        { name: "Bit Manipulation", count: 40, color: "#560bad" },
        { name: "Graph", count: 31, color: "#480ca8" },
        { name: "Two Pointer", count: 30, color: "#3f37c9" },
        { name: "Stack", count: 17, color: "#4895ef" },
        { name: "Linked List", count: 16, color: "#4cc9f0" },
    ],
    totalProblems: 1000,
    dailyGoal: 11
};

// Initialize completedDays from server data
let completedDays = initialCompletedDays || [];

// Current date for highlighting in calendar
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Start date of the plan - April 24, 2025
const startDate = new Date(2025, 3, 24);  // Month is 0-indexed (3 = April)

// End date - 3 months from start
const endDate = new Date(2025, 6, 24);    // 6 = July

// Initialize calendar with current month and year
let displayMonth = startDate.getMonth();
let displayYear = startDate.getFullYear();

// Calculate days left
const calculateDaysLeft = () => {
    const today = new Date();
    const endDate = new Date(2025, 6, 24);
    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Update days left in dashboard
document.getElementById('days-left').textContent = calculateDaysLeft();

// Generate topic distribution for each day
const generateDailyTopics = (date) => {
    // Check if it's a CodeForces contest day (Tuesday or Friday)
    const day = date.getDay();
    if (day === 2 || day === 5) { // Tuesday or Friday
        return {
            isContestDay: true,
            tasks: [
                { type: "codeforces", description: "CodeForces Contest (8PM - 10PM)" },
                { type: "spring-boot", description: "Spring Boot Learning (10:15PM - 11:30PM)" }
            ]
        };
    }

    // Regular day
    // Get week number to vary the topics
    const weekStart = new Date(startDate);
    const diffTime = Math.abs(date - weekStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7);

    // Select topics based on week number
    let todayTopics = [];
    
    // Basic distribution strategy
    // First month: Focus on fundamentals
    if (weekNumber < 4) {
        todayTopics = [
            { name: "Array Problems", count: 5 },
            { name: studyPlan.topics[0].name, count: 3 }, // Hashing/Prefix-Sum
            { name: studyPlan.topics[6].name, count: 2 }, // Two Pointer
            { name: studyPlan.topics[3].name, count: 1 }  // Binary Search
        ];
    } 
    // Second month: Mix of medium topics
    else if (weekNumber < 8) {
        todayTopics = [
            { name: studyPlan.topics[2].name, count: 4 }, // Greedy
            { name: studyPlan.topics[4].name, count: 3 }, // Bit Manipulation
            { name: studyPlan.topics[7].name, count: 2 }, // Stack
            { name: studyPlan.topics[5].name, count: 2 }  // Graph
        ];
    } 
    // Third month: Focus on advanced topics
    else {
        todayTopics = [
            { name: studyPlan.topics[1].name, count: 6 }, // Dynamic Programming
            { name: studyPlan.topics[5].name, count: 3 }, // Graph
            { name: "Tree + DP", count: 2 } // Tree + DP
        ];
    }
    
    // Add Spring Boot task
    const springBootTask = { type: "spring-boot", description: "Spring Boot Learning & Web App Dev (10:00PM - 11:30PM)" };
    
    // Weekend bonus
    if (day === 0 || day === 6) { // Sunday or Saturday
        return {
            isContestDay: false,
            isWeekend: true,
            topics: todayTopics,
            tasks: [
                { type: "algorithms", description: `Algorithm Practice (10-15 problems, ${todayTopics.map(t => t.name).join(", ")})` },
                { type: "web-app", description: "Web Application Development (Extra 2 hours)" },
                springBootTask
            ]
        };
    }

    return {
        isContestDay: false,
        isWeekend: false,
        topics: todayTopics,
        tasks: [
            { type: "algorithms", description: `Algorithm Practice (10-12 problems, ${todayTopics.map(t => t.name).join(", ")})` },
            springBootTask
        ]
    };
};

// Generate calendar
const generateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';
    
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // Create a table row
        const row = document.createElement('tr');
        
        // Creating individual cells
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            if (i === 0 && j < firstDay) {
                // Empty cells before the first day of month
                cell.classList.add('empty');
            } else if (date > daysInMonth) {
                // Empty cells after the last day of month
                cell.classList.add('empty');
            } else {
                // Valid calendar dates
                const currentDate = new Date(year, month, date);
                
                // Check if this date is within our study plan period
                const isInPlanPeriod = currentDate >= startDate && currentDate <= endDate;
                
                if (isInPlanPeriod) {
                    // Create date
                    const dateElem = document.createElement('div');
                    dateElem.classList.add('date');
                    dateElem.textContent = date;
                    cell.appendChild(dateElem);
                    
                    // Check if it's today
                    if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        cell.classList.add('current');
                    }
                    
                    // Check if it's a completed day
                    const dateString = `${year}-${month+1}-${date}`;
                    if (completedDays.includes(dateString)) {
                        cell.classList.add('completed');
                    }
                    
                    // Generate daily topics and tasks
                    const dailyPlan = generateDailyTopics(currentDate);
                    
                    // Add tags and tasks
                    if (dailyPlan.isContestDay) {
                        const contestTag = document.createElement('span');
                        contestTag.classList.add('topic-tag', 'codeforces');
                        contestTag.textContent = 'CodeForces';
                        cell.appendChild(contestTag);
                    } else {
                        const algoTag = document.createElement('span');
                        algoTag.classList.add('topic-tag', 'algorithms');
                        algoTag.textContent = 'Algo';
                        cell.appendChild(algoTag);
                    }
                    
                    const springTag = document.createElement('span');
                    springTag.classList.add('topic-tag', 'spring-boot');
                    springTag.textContent = 'Spring';
                    cell.appendChild(springTag);
                    
                    if (dailyPlan.isWeekend) {
                        const webTag = document.createElement('span');
                        webTag.classList.add('topic-tag', 'web-app');
                        webTag.textContent = 'Web App';
                        cell.appendChild(webTag);
                    }
                    
                    // Add task
                    const task = document.createElement('div');
                    task.classList.add('task');
                    task.textContent = dailyPlan.isContestDay ? 
                        'Contest + Spring Boot' : 
                        `${dailyPlan.isWeekend ? '12-15' : '10-12'} problems`;
                    cell.appendChild(task);
                    
                    // Make cell clickable to show details
                    cell.setAttribute('data-date', dateString);
                    cell.addEventListener('click', () => showTaskDetails(currentDate, dailyPlan));
                } else {
                    cell.classList.add('empty');
                }
                
                date++;
            }
            
            row.appendChild(cell);
        }
        
        calendarBody.appendChild(row);
        
        // Stop if we've reached the end of the month
        if (date > daysInMonth) {
            break;
        }
    }
    
    // Update month title
    document.getElementById('current-month').textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
};

// Show task details in modal
const showTaskDetails = (date, dailyPlan) => {
    const modal = document.getElementById('task-modal');
    const modalDate = document.getElementById('modal-date');
    const modalContent = document.getElementById('modal-content');
    const taskCompleted = document.getElementById('task-completed');
    const saveStatus = document.getElementById('save-status');
    
    // Clear previous save status
    saveStatus.textContent = '';
    saveStatus.className = 'save-status';
    
    // Format date
    const dateString = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    modalDate.textContent = dateString;
    
    // Clear previous content
    modalContent.innerHTML = '';
    
    // Add daily schedule
    const scheduleTitle = document.createElement('h4');
    scheduleTitle.textContent = 'Daily Schedule:';
    modalContent.appendChild(scheduleTitle);
    
    const scheduleList = document.createElement('ul');
    
    // Work hours
    const workItem = document.createElement('li');
    workItem.innerHTML = '<strong>10:00 AM - 8:00 PM:</strong> Work';
    scheduleList.appendChild(workItem);
    
    // Add all tasks
    dailyPlan.tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `<strong>${task.type === 'algorithms' ? '8:15 PM - 9:45 PM' : 
                              task.type === 'codeforces' ? '8:00 PM - 10:00 PM' : 
                              task.type === 'web-app' ? '10:00 AM - 12:00 PM' : 
                              '10:00 PM - 11:30 PM'}:</strong> ${task.description}`;
        scheduleList.appendChild(taskItem);
    });
    
    modalContent.appendChild(scheduleList);
    
    // If it has topics, display them
    if (!dailyPlan.isContestDay && dailyPlan.topics) {
        const topicsTitle = document.createElement('h4');
        topicsTitle.textContent = 'Problem Breakdown:';
        topicsTitle.style.marginTop = '15px';
        modalContent.appendChild(topicsTitle);
        
        const topicsList = document.createElement('ul');
        dailyPlan.topics.forEach(topic => {
            const topicItem = document.createElement('li');
            topicItem.textContent = `${topic.name}: ${topic.count} problems`;
            topicsList.appendChild(topicItem);
        });
        
        modalContent.appendChild(topicsList);
    }
    
    // Add tips
    const tipsTitle = document.createElement('h4');
    tipsTitle.textContent = 'Tips:';
    tipsTitle.style.marginTop = '15px';
    modalContent.appendChild(tipsTitle);
    
    const tipsList = document.createElement('ul');
    
    if (dailyPlan.isContestDay) {
        tipsList.innerHTML = `
            <li>Focus on the contest and give it your full attention for the 2 hours</li>
            <li>After the contest, review solutions to problems you couldn't solve</li>
            <li>Use the Spring Boot session to build on your web application</li>
        `;
    } else if (dailyPlan.isWeekend) {
        tipsList.innerHTML = `
            <li>Take advantage of the weekend to tackle more complex problems</li>
            <li>Spend extra time on web application development</li>
            <li>Review the week's learning and consolidate knowledge</li>
        `;
    } else {
        tipsList.innerHTML = `
            <li>Focus on consistency and completing the daily goal</li>
            <li>If time is short, prioritize problems from topics you find challenging</li>
            <li>Document your progress and make notes of difficult problems for weekend review</li>
        `;
    }
    
    modalContent.appendChild(tipsList);
    
    // Check if this day is marked as completed
    const dateKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    taskCompleted.checked = completedDays.includes(dateKey);
    
    // Add event listener to checkbox
    taskCompleted.onchange = function() {
        if (this.checked) {
            // Add to completed days if not already there
            if (!completedDays.includes(dateKey)) {
                completedDays.push(dateKey);
            }
        } else {
            // Remove from completed days
            completedDays = completedDays.filter(day => day !== dateKey);
        }
        
        // Update calendar
        generateCalendar(displayMonth, displayYear);
        
        // Update progress
        updateProgress();
        
        // Save to database via API
        saveProgress(completedDays);
    };
    
    // Show modal
    modal.style.display = 'block';
};

// Save progress to database
const saveProgress = async (completedDays) => {
    const saveStatus = document.getElementById('save-status');
    
    try {
        const response = await fetch('/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completedDays })
        });
        
        const data = await response.json();
        
        if (data.success) {
            saveStatus.textContent = 'Progress saved successfully!';
            saveStatus.className = 'save-status save-success';
            
            // Fade out the message after 3 seconds
            setTimeout(() => {
                saveStatus.style.opacity = '0';
                
                // Reset opacity after fade out animation completes
                setTimeout(() => {
                    saveStatus.style.opacity = '1';
                    saveStatus.textContent = '';
                }, 1000);
            }, 3000);
        } else {
            throw new Error('Failed to save progress');
        }
    } catch (error) {
        console.error('Error saving progress:', error);
        saveStatus.textContent = 'Error saving progress. Please try again.';
        saveStatus.className = 'save-status save-error';
    }
};

// Close modal when clicking the X
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('task-modal').style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('task-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Update progress bar
const updateProgress = () => {
    const totalDays = 92; // 3 months
    const completedPercentage = (completedDays.length / totalDays) * 100;
    
    document.getElementById('progress-percentage').textContent = `${Math.round(completedPercentage)}%`;
    document.getElementById('main-progress').style.width = `${completedPercentage}%`;
};

// Add to the existing code in main.js
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.getElementById('task-modal').style.display = 'none';
    }
});

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calendar
    generateCalendar(displayMonth, displayYear);
    
    // Initialize progress
    updateProgress();
    
    // Event listeners for previous and next month buttons
    document.getElementById('prev-month').addEventListener('click', () => {
        // Only allow going back to the start month
        if (displayMonth > startDate.getMonth() || displayYear > startDate.getFullYear()) {
            if (displayMonth === 0) {
                displayMonth = 11;
                displayYear--;
            } else {
                displayMonth--;
            }
            generateCalendar(displayMonth, displayYear);
        }
    });

    document.getElementById('next-month').addEventListener('click', () => {
        // Only allow going forward to the end month
        if (displayMonth < endDate.getMonth() || displayYear < endDate.getFullYear()) {
            if (displayMonth === 11) {
                displayMonth = 0;
                displayYear++;
            } else {
                displayMonth++;
            }
            generateCalendar(displayMonth, displayYear);
        }
    });
});