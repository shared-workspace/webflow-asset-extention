
// const collectionMap = ref<CollectionMap>(new Map());
// export default function useAssetLiberaryMap(Webflow: WebflowApi) {
//     // Fetch the default variable collection
//     Webflow.getDefaultVariableCollection().then((defaultVariableCollection) => {

//         if (defaultVariableCollection) {

//             // Print Collection ID
//             console.log("Default Variable Collection ID:", defaultVariableCollection.id);

//             // Fetch all variables within the default collection
//             defaultVariableCollection.getAllVariables().then((variables) => {

//                 if (variables.length > 0) {

//                     console.log("List of Variables in Default Collection:");

//                     // Print variable details
//                     for (var i in variables) {
//                         console.log(`${i}. Variable Name: ${await variables[i].getName()}, Variable ID: ${variables[i].id}`);
//                     };
//                 } else {
//                     console.log("No variables found in the default collection.");
//                 }
//             })
//         } else {
//             console.log("Default Variable Collection not found.");
//         }
//     })
// }