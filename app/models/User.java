package models;

import javax.persistence.Entity;

import play.db.ebean.Model;

@Entity
public class User extends Model {

	private static final long serialVersionUID = -8425213041824976820L;

	private String userUID;
	private String googleUID;
	private String email;
	private String password;

	// -- Queries
	public static Model.Finder<String, User> find = new Finder<String, User>(String.class, User.class);

	// --
	
	public String getUserUID() {
		return userUID;
	}

	public void setUserUID(String userUID) {
		this.userUID = userUID;
	}

	public String getGoogleUID() {
		return googleUID;
	}

	public void setGoogleUID(String googleUID) {
		this.googleUID = googleUID;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	
}