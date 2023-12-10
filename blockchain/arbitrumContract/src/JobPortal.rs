// Dependencies
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, log, near_bindgen};

// Structures
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Project {
    pub project_uri: String,
    pub project_id: u32,
    pub project_manager: AccountId,
    pub tasks: Vec<Task>,
    pub task_count: u32,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Task {
    pub task_uri: String,
    pub task_id: u32,
    pub staked_amount: Balance,
    pub proposals: Vec<Proposal>,
    pub selected_worker: Option<AccountId>,
    pub proposal_count: u32,
    pub completed: bool,
    pub reviewed: bool,
    pub on_going: bool,
    pub submission_uri: Option<String>,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Proposal {
    pub is_waiting: bool,
    pub is_accepted: bool,
    pub proposal_uri: String,
    pub freelancer: AccountId,
    pub bid_amount: Balance,
    pub motivation: String,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Person {
    pub person_uri: String,
    pub name: String,
    pub wallet_address: AccountId,
    pub description: String,
    pub rating: u32,
    pub total_projects: u32,
    pub total_tasks: u32,
}

// Contract
#[near_bindgen]
pub struct JobPortal {
    pub projects: Vec<Project>,
    pub project_count: u32,
    pub person: HashMap<AccountId, Person>,
}

// Events
#[derive(Serialize, Deserialize, BorshSerialize, BorshDeserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum LogEvent {
    NewProject(u32, AccountId, String),
    NewTask(u32, u32, Balance, String),
    NewProposal(u32, u32, AccountId, Balance, String, bool, bool),
    WorkerSelected(u32, u32, AccountId),
    TaskCompleted(u32, u32),
    ReviewCompleted(u32, u32),
    PaymentReleased(u32, u32, AccountId, Balance),
}

// Implementations
#[near_bindgen]
impl JobPortal {
    #[init]
    pub fn new() -> Self {
        Self {
            projects: vec![],
            project_count: 0,
            person: HashMap::new(),
        }
    }

    // Getters
    pub fn get_balance(&self) -> Balance {
        env::account_balance()
    }

    pub fn get_current_project_id(&self) -> u32 {
        self.project_count - 1
    }

    pub fn get_task_count_by_project_id(&self, project_id: u32) -> u32 {
        self.projects[project_id as usize].task_count
    }

    pub fn get_task_data(&self, project_id: u32, task_id: u32) -> (
        String,
        u32,
        Balance,
        u32,
        Option<AccountId>,
        bool,
        bool,
        bool,
        Option<String>,
    ) {
        let task = &self.projects[project_id as usize].tasks[task_id as usize];

        (
            task.task_uri.clone(),
            task.task_id,
            task.staked_amount,
            task.proposal_count,
            task.selected_worker,
            task.completed,
            task.reviewed,
            task.on_going,
            task.submission_uri.clone(),
        )
    }

    pub fn get_proposals_by_task_id(&self, project_id: u32,
