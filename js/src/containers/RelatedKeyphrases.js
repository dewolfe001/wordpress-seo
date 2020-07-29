/* External dependencies */
import {withDispatch, withSelect} from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import RelatedKeyphraseModalContent from "../components/RelatedKeyphraseModalContent";

export default compose( [
	withSelect( ( select ) => {
		return {
			keyphrase: select( "yoast-seo/editor" ).getFocusKeyphrase(),
			currentDatabase: select( "yoast-seo/editor" ).getSEMrushSelectedDatabase(),
			OAuthToken: select( "yoast-seo/editor" ).getSEMrushRequestOAuthToken(),
			requestLimitReached: select( "yoast-seo/editor" ).getSEMrushRequestLimitReached(),
			response: select( "yoast-seo/editor" ).getSEMrushRequestResponse(),
			isSuccess: select( "yoast-seo/editor" ).getSEMrushRequestIsSuccess(),
			isPending: select( "yoast-seo/editor" ).getSEMrushIsRequestPending(),
			keyphraseLimitReached: select( "yoast-seo/editor" ).getSEMrushLimitReached(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setSEMrushChangeDatabase,
			setSEMrushNewRequest, setSEMrushRequestSucceeded, setSEMrushRequestFailed,
			setSEMrushSetRequestLimitReached, addSEMrushKeyphrase, removeSEMrushKeyphrase,
			setSEMrushKeyphraseLimitReached } = dispatch(
			"yoast-seo/editor"
		);
		return {
			setDatabase: ( database ) => {
				setSEMrushChangeDatabase( database );
			},
			newRequest: ( database, keyphrase, OAuthToken ) => {
				setSEMrushNewRequest( database, keyphrase, OAuthToken );
			},
			setRequestSucceeded: ( response ) => {
				setSEMrushRequestSucceeded( response );
			},
			setRequestFailed: ( response ) => {
				setSEMrushRequestFailed( response );
			},
			setRequestLimitReached: () => {
				setSEMrushSetRequestLimitReached();
			},
			addRelatedKeyphrase: ( keyphrase ) => {
				addSEMrushKeyphrase( keyphrase );
			},
			removeRelatedKeyphrase: ( keyphrase ) => {
				removeSEMrushKeyphrase( keyphrase );
			},
			setKeyphraseLimitReached: () => {
				setSEMrushKeyphraseLimitReached();
			},
		};
	} ),
] )( RelatedKeyphraseModalContent );
