package com.springboot.MyTodoList.util;

public enum BotMessages {
	
	HELLO_MYTODO_BOT(
	"Hola!, mi nombre es devmate bot 🤖, el bot de administración de tareas de Oarcle!\nPor favor abre  mennu en la barra inferior del chat!"),
	BOT_REGISTERED_STARTED("Bot registrado"),
	ITEM_DONE("Item realizado! ✅ puedes revisar tus otras tareas en /todolist , o si prefieres inciiar de nuevo presiona /start."), 
	ITEM_UNDONE("Item no realizado! 🚫 puedes revisar tus otras tareas en /todolist , o si prefieres inciiar de nuevo presiona /start."), 
	ITEM_DELETED("Item eliminado! 🗑️ puedes revisar tus otras tareas en /todolist , o si prefieres inciiar de nuevo presiona /start."),
	TYPE_NEW_TODO_ITEM("Por favor porprocioname el nombre de la nueva tarea que deseas agregar:"),
	NEW_ITEM_ADDED("Item agregado! ➕ puedes revisar tus otras tareas en /todolist , o si prefieres inciiar de nuevo presiona /start."),
	BYE("Gracias por usar DEVMATE BOT! 🤖 by: Team 15");

	private String message;

	BotMessages(String enumMessage) {
		this.message = enumMessage;
	}

	public String getMessage() {
		return message;
	}

}
