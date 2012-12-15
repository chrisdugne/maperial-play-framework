package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Dataset extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String datasetUID;
	
	@Expose
	private String name;

	@Expose
	private Long size;

	@Expose
	private Long uploadTime;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private Account account;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Dataset> find = new Finder<String, Dataset>(String.class, Dataset.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getDatasetUID() {
		return datasetUID;
	}
	
	public void setDatasetUID(String datasetUID) {
		this.datasetUID = datasetUID;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getUploadTime() {
		return uploadTime;
	}

	public void setUploadTime(Long uploadTime) {
		this.uploadTime = uploadTime;
	}
	
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
	
	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	// -----------------------------------------------------------------------------------------------//
	
	private static final long serialVersionUID = 8056258933792278781L;
}
