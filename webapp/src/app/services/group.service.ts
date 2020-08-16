import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { tap } from 'rxjs/operators';
import { Group } from "../model/group.model";

/**
 * Service class for the Group Component. Works with every component.
 *
 * @author goelsarthak
 */
@Injectable({
  providedIn: "root",
})
export class GroupService {

  // Subject created to perform refresh and get live data
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  /**
   * Constructor.
   */
  constructor(private http: HttpClient) {}

  /**
   * Service to call api for adding a group.
   *
   * @param {name} string
   * @param {memberEmail} string
   * @return {Group}
   */
  public addGroup(name: string, memberEmail: string[]) {
    const groupType = "DEFAULT";
    const group: Group = {
      id: "",
      name: name,
      groupType: "DEFAULT",
      createdBy: "",
      memberEmail: memberEmail,
      members: [],
    };
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.post(
      "http://localhost:3000/v1/groups",
      JSON.stringify(group),
      header
    ).pipe(tap(()=>{
      this._refreshNeeded$.next();
    }));
  }

  /**
   * Service to call api for getting details of a single user
   *
   * @return {Group[]}
   */
  public getGroupDetails() {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<Group[]>("http://localhost:3000/v1/groups", header);
  }

  /**
   * Service to call api for getting group by id
   *
   * @param {groupID} string
   * @return {Group} Group
   */
  public getGroupById(groupId: string) {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<Group>(
      "http://localhost:3000/v1/groups/" + groupId,
      header
    );
  }


  /**
   * Service to call api for getting single Group
   *
   * @param {id} string
   * @return {Group} Group
   */
  public getGroupByGroupId(id:string) {
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.get<Group>(
      "http://localhost:3000/v1/groups/" + id,
      header
    );
  }


  /**
   * Service to call api for deleting a group
   *
   * @param {id} string
   * @return {Group} Group
   */
  public deleteGroup(groupId: string){
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.delete("http://localhost:3000/v1/groups/" + groupId, header).pipe(tap(() => {
      this._refreshNeeded$.next();
    }));
  }

  /**
   * Service to call api for updating a group
   *
   * @param {id} string
   * @param {name} name
   * @param {memberEmail} string[]
   * @return {Group} Group
   */
  public updateGroup(groupId:string, name: string, memberEmail: string[]) {
    const groupType = "DEFAULT";
    const group: Group = {
      id: "",
      name: name,
      groupType: "DEFAULT",
      createdBy: "",
      memberEmail: memberEmail,
      members: [],
    };
    const token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders().set("Authorization", `Token ` + token),
    };
    return this.http.put( "http://localhost:3000/v1/groups/"+groupId, JSON.stringify(group), header).pipe(tap(()=>{
      this._refreshNeeded$.next();
    }));
  }
}
