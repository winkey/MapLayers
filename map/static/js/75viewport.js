/*******************************************************************************
  viewport
*******************************************************************************/

function NewWorld_Viewport_Create(mapPanel, tree) {
	
    new Ext.Viewport({
        layout: "fit",
        hideBorders: true,
        items: {
            layout: "border",
            deferredRender: false,
            items: [mapPanel, tree]
        }
    });

}