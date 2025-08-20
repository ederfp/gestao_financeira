flowchart TD
Start([Usuário Acessa Sistema]) --> AuthCheck{Usuário<br/>Autenticado?}

%% Fluxo de Autenticação
AuthCheck -->|Não| LoginPage[Tela de Login]
AuthCheck -->|Sim| Dashboard[Dashboard Principal]

LoginPage --> LoginChoice{Escolha}
LoginChoice -->|Login| LoginForm[Formulário de Login]
LoginChoice -->|Cadastro| SignupForm[Formulário de Cadastro]
LoginChoice -->|Esqueci Senha| PasswordReset[Recuperação de Senha]

LoginForm --> Auth2FA{2FA Ativado?}
Auth2FA -->|Sim| TwoFactor[Verificação 2FA]
Auth2FA -->|Não| Dashboard
TwoFactor --> Dashboard

SignupForm --> EmailVerify[Verificação de Email]
EmailVerify --> Onboarding[Fluxo de Onboarding]

%% Fluxo de Onboarding
Onboarding --> Profile[Configuração de Perfil]
Profile --> FirstAccount[Adicionar Primeira Conta]
FirstAccount --> AccountType{Tipo de Conta}
AccountType -->|Banco| BankAccount[Conta Bancária]
AccountType -->|Cartão| CreditCard[Cartão de Crédito]
AccountType -->|Digital| DigitalWallet[Carteira Digital]

BankAccount --> FirstTransaction[Primeiro Lançamento]
CreditCard --> FirstTransaction
DigitalWallet --> FirstTransaction

FirstTransaction --> Tour[Tour Guiado]
Tour --> Dashboard

%% Dashboard e Navegação Principal
Dashboard --> MainMenu{Menu Principal}

MainMenu -->|Contas| AccountsManagement[Gestão de Contas]
MainMenu -->|Lançamentos| Transactions[Lançamentos]
MainMenu -->|Orçamento| Budget[Orçamento]
MainMenu -->|Relatórios| Reports[Relatórios]
MainMenu -->|Metas| Goals[Metas Financeiras]
MainMenu -->|Perfil| UserProfile[Perfil do Usuário]

%% Fluxo de Lançamentos
Transactions --> TransactionType{Tipo de<br/>Lançamento}
TransactionType -->|Receita| Income[Registrar Receita]
TransactionType -->|Despesa| Expense[Registrar Despesa]
TransactionType -->|Recorrente| Recurring[Lançamento Recorrente]

Income --> TransactionForm[Formulário de Lançamento]
Expense --> TransactionForm
Recurring --> RecurringConfig[Configurar Recorrência]
RecurringConfig --> TransactionForm

TransactionForm --> CategorySelect[Selecionar Categoria]
CategorySelect --> CategoryChoice{Categoria}
CategoryChoice -->|Existente| SelectExisting[Escolher Categoria]
CategoryChoice -->|Nova| CreateCategory[Criar Nova Categoria]

SelectExisting --> AttachReceipt{Anexar<br/>Comprovante?}
CreateCategory --> AttachReceipt

AttachReceipt -->|Sim| UploadFile[Upload de Arquivo]
AttachReceipt -->|Não| SaveTransaction[Salvar Lançamento]
UploadFile --> SaveTransaction

SaveTransaction --> TransactionSuccess[Confirmação]
TransactionSuccess --> Dashboard

%% Fluxo de Gestão de Contas
AccountsManagement --> AccountAction{Ação}
AccountAction -->|Adicionar| AddAccount[Nova Conta]
AccountAction -->|Editar| EditAccount[Editar Conta]
AccountAction -->|Remover| DeleteAccount[Remover Conta]
AccountAction -->|Visualizar| ViewBalance[Ver Saldos]

AddAccount --> AccountForm[Formulário de Conta]
EditAccount --> AccountForm
AccountForm --> SaveAccount[Salvar Conta]
SaveAccount --> AccountsManagement

%% Fluxo de Orçamento
Budget --> BudgetAction{Ação}
BudgetAction -->|Definir| SetBudget[Definir Orçamento]
BudgetAction -->|Acompanhar| TrackBudget[Acompanhar Consumo]
BudgetAction -->|Alertas| BudgetAlerts[Configurar Alertas]

SetBudget --> BudgetCategories[Orçamento por Categoria]
BudgetCategories --> BudgetValue[Definir Valores]
BudgetValue --> SaveBudget[Salvar Orçamento]
SaveBudget --> Budget

TrackBudget --> BudgetStatus{Status}
BudgetStatus -->|Normal| GreenStatus[✓ Dentro do Limite]
BudgetStatus -->|Alerta| YellowStatus[⚠ Próximo do Limite]
BudgetStatus -->|Excedido| RedStatus[✗ Limite Excedido]

%% Fluxo de Relatórios
Reports --> ReportType{Tipo de<br/>Relatório}
ReportType -->|Extrato| Statement[Extrato Mensal]
ReportType -->|Gráficos| Charts[Gráficos e Análises]
ReportType -->|Comparativo| Comparison[Comparativo de Períodos]

Statement --> ExportOption{Exportar?}
Charts --> ExportOption
Comparison --> ExportOption

ExportOption -->|PDF| GeneratePDF[Gerar PDF]
ExportOption -->|Excel| GenerateExcel[Gerar Excel]
ExportOption -->|Visualizar| ViewReport[Visualizar na Tela]

%% Fluxo de Metas
Goals --> GoalAction{Ação}
GoalAction -->|Criar| CreateGoal[Nova Meta]
GoalAction -->|Acompanhar| TrackGoal[Acompanhar Progresso]
GoalAction -->|Editar| EditGoal[Editar Meta]

CreateGoal --> GoalForm[Definir Meta]
GoalForm --> GoalDetails[Valor e Prazo]
GoalDetails --> SavingPlan[Plano de Economia]
SavingPlan --> SaveGoal[Salvar Meta]
SaveGoal --> Goals

TrackGoal --> Progress{Progresso}
Progress -->|0-33%| InitialPhase[Fase Inicial]
Progress -->|34-66%| MiddlePhase[Meio do Caminho]
Progress -->|67-99%| AlmostThere[Quase Lá]
Progress -->|100%| GoalAchieved[🎉 Meta Alcançada]

%% Fluxo de Perfil
UserProfile --> ProfileAction{Ação}
ProfileAction -->|Dados| EditProfile[Editar Dados]
ProfileAction -->|Segurança| Security[Configurações de Segurança]
ProfileAction -->|Preferências| Preferences[Preferências]
ProfileAction -->|Sair| Logout[Fazer Logout]

Security --> SecurityOption{Opção}
SecurityOption -->|Senha| ChangePassword[Alterar Senha]
SecurityOption -->|2FA| Setup2FA[Configurar 2FA]

Preferences --> PrefOption{Preferência}
PrefOption -->|Idioma| Language[Idioma]
PrefOption -->|Tema| Theme[Tema (Light/Dark)]
PrefOption -->|Notificações| Notifications[Notificações]

Logout --> Start

%% Estilos
classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px
classDef process fill:#fff3e0,stroke:#e65100,stroke-width:2px
classDef decision fill:#fce4ec,stroke:#880e4f,stroke-width:2px
classDef success fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
classDef warning fill:#fff9c4,stroke:#f57f17,stroke-width:2px
classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px

class Start,Dashboard startEnd
class LoginPage,SignupForm,TransactionForm,AccountForm,BudgetCategories,GoalForm process
class AuthCheck,LoginChoice,TransactionType,CategoryChoice,BudgetStatus,Progress decision
class TransactionSuccess,GoalAchieved success
class YellowStatus warning
class RedStatus error