package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name="public.colorbar")
public class ColorBar extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	private String colorBarUID;

	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, ColorBar> find = new Finder<String, ColorBar>(String.class, ColorBar.class);

	// -----------------------------------------------------------------------------------------------//

	public String getColorBarUID() {
		return colorBarUID;
	}
	
	public void setColorBarUID(String colorBarUID) {
		this.colorBarUID = colorBarUID;
	}

	// -----------------------------------------------------------------------------------------------//
	
	private static final long serialVersionUID = 7522352657099709486L;
}