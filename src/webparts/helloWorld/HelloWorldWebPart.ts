import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IHelloWorldWebPartProps {
  Title:string;
}

export interface ISPList {
  value: ISPList[];
}

export interface ISPItem {
  Title: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  private _renderListAsync(): void {
    this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('Test')/Items",SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
    return response.json();
    })
    .then((response) => {
      this._renderList(response.value);
    });
 }
  private _renderList(items: ISPItem[]): void {
    let html: string = '<table border=1 width=100% style="border-collapse: collapse;">';
    html += '<th>Title</th>';
    items.forEach((item: ISPItem) => {
      html += `<tr><td>${item.Title}</td></tr>`;
    });
    html += '</table>';
  
    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }
    
public render(): void {
  this.domElement.innerHTML = `
    <div class="">
          <div>
            <span>Welcome to SharePoint Modern Developmennt</span>
            <p>Loading from ${this.context.pageContext.web.title}</p>
            <p>Retrive Data from SharePoint List</p>
          </div>
        <div>
        <div>List Items</div>
        <br>
         <div id="spListContainer" />
    </div>`;
    this._renderListAsync();
}

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
