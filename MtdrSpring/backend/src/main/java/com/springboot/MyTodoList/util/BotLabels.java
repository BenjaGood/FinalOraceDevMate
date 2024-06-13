package com.springboot.MyTodoList.util;

public enum BotLabels {
	
	SHOW_MAIN_SCREEN("Menú Principal 📜"), 
	HIDE_MAIN_SCREEN("Ayuda y Soporte ⚙️"),
	LIST_ALL_ITEMS("Ver las tareas 📋"), 
	ADD_NEW_ITEM("Agregar Tarea ➕"),
	DONE("Terminada ✅"),
	UNDO("No terminada 🚫"),
	DELETE("Borrar 🗑️"),
	MY_TODO_LIST("Tareas Por Hacer ⏱️"),
	DASH("-");

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
