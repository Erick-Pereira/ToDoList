describe('To-do List', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html');
  });
 
  it('Deve adicionar uma nova tarefa', () => {
    cy.get('#Input-Task').type('Nova Tarefa');
    cy.get('#Input-Priority').select('medium');
    cy.get('#add-task-button').click();
    cy.get('#toDoList').should('contain', 'Nova Tarefa');
  });
 
  it('Deve exibir um alerta se a tarefa estiver vazia', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
    cy.get('#add-task-button').click();
    cy.get('@alert').should('have.been.calledWith', 'Digite algo para inserir em sua lista');
    cy.get('#toDoList').should('be.empty');
  });
 
  it('Deve finalizar uma tarefa', () => {
    cy.get('#Input-Task').type('Tarefa para finalizar');
    cy.get('#Input-Priority').select('high');
    cy.get('#add-task-button').click();
    cy.get('#toDoList').contains('Tarefa para finalizar').parent().find('button').contains('Finalizar').click();
    cy.get('#finished').should('contain', 'Tarefa para finalizar');
  });
 
  it('Deve deletar uma tarefa finalizada', () => {
    cy.get('#Input-Task').type('Tarefa para deletar');
    cy.get('#Input-Priority').select('low');
    cy.get('#add-task-button').click();
    cy.get('#toDoList').contains('Tarefa para deletar').parent().find('button').contains('Finalizar').click();
    cy.get('#finished').contains('Tarefa para deletar').parent().find('button').contains('Deletar').click();
    cy.get('#finished').should('not.contain', 'Tarefa para deletar');
  });
 
  it('Deve editar uma tarefa', () => {
    cy.get('#Input-Task').type('Tarefa para editar');
    cy.get('#Input-Priority').select('medium');
    cy.get('#add-task-button').click();
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('Tarefa Editada');
    });
    cy.get('#toDoList').contains('Tarefa para editar').parent().find('button').contains('Editar').click();
    cy.get('#toDoList').should('contain', 'Tarefa Editada');
  });
});