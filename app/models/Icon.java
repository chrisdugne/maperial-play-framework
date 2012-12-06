package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.google.gson.annotations.Expose;

import play.db.ebean.Model;

@Entity
@Table(name="public.icon")
public class Icon extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String iconUID;
	
	@Expose
	private String name;

	@Expose
	private Boolean isPublic;
	
	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private User user;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Icon> find = new Finder<String, Icon>(String.class, Icon.class);

	// -----------------------------------------------------------------------------------------------//

	public String getIconUID() {
		return iconUID;
	}
	
	public void setIconUID(String iconUID) {
		this.iconUID = iconUID;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public Boolean getIsPublic() {
		return isPublic;
	}

	public void setIsPublic(Boolean isPublic) {
		this.isPublic = isPublic;
	}

	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = -2129947718996775259L;

	// -----------------------------------------------------------------------------------------------//

}