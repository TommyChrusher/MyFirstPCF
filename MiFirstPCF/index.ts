import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class MiFirstPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    /**
     * Empty constructor.
     */
    private httpResponse = {}

    constructor() {
        this.httpResponse = {}
    }
    public checkMethod(method: string) {
        const text = method
        const options = ["GET", "POST", "PUT", "DELETE", "PATCH"]
        return options.includes(text)
    }

    public checkUrl(url:string){
        try{
            new URL(url);
            return true
        }catch{
            return false
        }
    }
    public async request(reqUrl: string,reqMethod:string,reqHeaders:string,reqBody:string) {
        try {
            const bodyRequest: RequestInit = {
                method: reqMethod,
                headers: JSON.parse(reqHeaders),
                body: JSON.stringify(reqBody)
            }
            const response = await fetch(reqUrl,bodyRequest);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json(); // Convertir la respuesta a JSON
            return data
        } catch (error) {
            console.log("error en el request " + error)
        }
    }
    public async fetchData(url: string,method:string,headers:string,body:string) {
        try {
            this.httpResponse = await this.request(url,method,headers,body);  // Notificar cambios
        } catch (error) {
            console.error("Error en fetchData:", error);
        }
    }


    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        // Add control initialization code
        console.log("componente inicializado")
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        const url = String(context.parameters.url.raw)
        const method = String(context.parameters.method.raw)
        const headers = String(context.parameters.method.raw)
        const body = String(context.parameters.body.raw)
        console.log("url" + url)
        console.log("method" + method)
        if (this.checkMethod(method) && this.checkUrl(url)) {
            this.httpResponse = this.fetchData(url,method,headers,body)
            this.getOutputs()
        } else {
            console.log("no se ejecuta")
        }


    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        const data = this.httpResponse
        console.log("Response " + JSON.stringify(data))
        return { outputData: data };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
