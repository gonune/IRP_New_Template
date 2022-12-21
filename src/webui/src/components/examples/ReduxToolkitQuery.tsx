import {
  useFetchCatalogItemsQuery,
  useCreateCatalogItemMutation
} from '../../hooks/useAPIs';
import { CustomButton } from '../HOCs/CustomButton';

export const ExampleRTKQuery: React.FC = () => {
  // We get these properties for free because we designed this API with RTK
  const { data, error, isLoading } = useFetchCatalogItemsQuery();
  // Unlike the query hook above that gets executed instantly, mutations give us
  // back a function that we can call at a later time
  const [createCatalogItem, results] = useCreateCatalogItemMutation();

  const handleCreateCatalogItem = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const fakeCatalogItemRequest = {
      name: `Test catalog item ${randomNumber}`,
      description:
        'A catalog item created by the Redux Toolkit Query example in IRP_New_Projects demo ReactJS app',
      created_by: 'Tara.StClair@sas.com',
      category_id: 1,
      item_type_id: 1,
      file_url:
        'https://aqueductcontent.blob.core.windows.net/aqueduct-content/Nicotiana-Starlight-Queen_1669125255186.png'
    };

    // Call the function from the mutation hook now
    createCatalogItem(fakeCatalogItemRequest);
  };

  //console.log(data, error, isLoading);
  return (
    <div>
      <p>
        In this example, we are using Redux Toolkit (RTK) Query to design an API
        to work with a set of external services that deal with catalog items.
        The values below are generated by a call to fetch catalog items. Try
        using the button to make a call to create a new catalog item and notice
        that the item count automatically increases by one. RTK lets us tag
        these methods so that when a "mutation" occurs, the "queries" are
        immediately invalidated and re-run to fetch updated data.
      </p>
      <b>Data (item count): </b>
      {data?.item_count}
      <br />
      <b>Loading: </b>
      {/* Need string interpolation on this so it renders on screen as desired */}
      {`${isLoading}`}
      <br />
      <br />
      <CustomButton outline color="primary" onClick={handleCreateCatalogItem}>
        Create a new catalog item
      </CustomButton>
    </div>
  );
};
