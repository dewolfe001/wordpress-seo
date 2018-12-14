import buildTree from "../../../src/tree/builder/buildTree";
import printTree from "../../../src/tree/utils/printTree";

import StructuredNode from "../../../src/tree/values/nodes/StructuredNode";
import Paragraph from "../../../src/tree/values/nodes/Paragraph";
import FormattingElement from "../../../src/tree/values/FormattingElement";
import TextContainer from "../../../src/tree/values/nodes/TextContainer";
import Heading from "../../../src/tree/values/nodes/Heading";
import List from "../../../src/tree/values/nodes/List";
import ListItem from "../../../src/tree/values/nodes/ListItem";

describe( "build tree", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	it( "can build a tree from html", () => {
		const html = "<section>This? is a section.</section>";

		const tree = buildTree( html );

		console.log( printTree( tree ).join( "\n" ) );
	} );

	it( "can parse an HTML into a Paragraph", () => {
		const input = "<p>This <strong id='some-id'>sentence</strong> needs to be <emph>read</emph> to have value as a sentence.</p>";

		const tree = buildTree( input );

		const formatting = new FormattingElement(
			"strong",
			// "This ".length
			5,
			// "This sentence".length
			13,
			{},
		);

		const textContainer = new TextContainer();
		textContainer.text = "This sentence needs to be read to have value as a sentence.";
		textContainer.formatting = formatting;

		const paragraph = new Paragraph( "p" );
		paragraph.startIndex = 0;
		paragraph.endIndex = 81;
		paragraph.textContainer = textContainer;

		const expected = new StructuredNode();
		expected.startIndex = 0;
		expected.endIndex = 81;
		expected.children = [ paragraph ];

		console.log( printTree( tree ).join( "\n" ) );
		// expect(  JSON.stringify( tree ) ).toEqual( JSON.stringify( expected ) );
	} );

	it( "can parse an HTML into a Heading", () => {
		const input = "<h1>This heading needs to be read to have value as a heading.</h1>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.startIndex = 0;
		heading.endIndex = 81;
		heading.text = "This heading needs to be read to have value as a heading.";

		const expected = new StructuredNode();
		expected.startIndex = 0;
		expected.endIndex = 81;
		expected.children = [ heading ];

		console.log( printTree( tree ).join( "\n" ) );
		// expect(  JSON.stringify( tree ) ).toEqual( JSON.stringify( expected ) );
	} );

	it( "can parse an HTML comment into Structured Irrelevant node", () => {
		const input = "<section><!-- An unimportant comment. --></section>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.startIndex = 9;
		heading.endIndex = 31;
		heading.text = "First heading";

		const paragraph = new Paragraph( "" );
		paragraph.startIndex = 31;
		paragraph.endIndex = 70;
		paragraph.text = "This sentence. Another sentence.";

		const expected = new StructuredNode( "section" );
		expected.startIndex = 0;
		expected.endIndex = 62;
		expected.children = [ heading, paragraph ];

		console.log( printTree( tree ).join( "\n" ) );
		// expect(  JSON.stringify( tree ) ).toEqual( JSON.stringify( expected ) );
	} );

	it( "can parse HTML into a List with ListItems, which are simple paragraphs", () => {
		const input = "<ul><li>Coffee</li><li>Tea</li></ul>";

		const tree = buildTree( input );

		const paragraph1 = new Paragraph( "" );
		paragraph1.startIndex = 8;
		paragraph1.endIndex = 13;
		paragraph1.text = "Coffee";

		const listItem1 = new ListItem();
		listItem1.startIndex = 4;
		listItem1.endIndex = 18;
		listItem1.children = [ paragraph1 ];

		const paragraph2 = new Paragraph( "" );
		paragraph2.startIndex = 22;
		paragraph2.endIndex = 25;
		paragraph2.text = "Tea";

		const listItem2 = new ListItem();
		listItem2.startIndex = 19;
		listItem2.endIndex = 30;
		listItem2.children = [ paragraph2 ];

		const list = new List( false );
		list.startIndex = 0;
		list.endIndex = 35;
		list.children = [ listItem1, listItem2 ];

		const expected = new StructuredNode();
		expected.startIndex = 0;
		expected.endIndex = 35;
		expected.children = [ list ];

		console.log( printTree( tree ).join( "\n" ) );
		// expect(  JSON.stringify( tree ) ).toEqual( JSON.stringify( expected ) );
	} );

	it( "can parse HTML into a List with ListItems, which are simple paragraphs or structured nodes", () => {
		const input = "<ul><li>Coffee</li><li><section>Tea</section></li></ul>";

		const tree = buildTree( input );

		const paragraph1 = new Paragraph( "" );
		paragraph1.startIndex = 8;
		paragraph1.endIndex = 13;
		paragraph1.text = "Coffee";

		const listItem1 = new ListItem();
		listItem1.startIndex = 4;
		listItem1.endIndex = 18;
		listItem1.children = [ paragraph1 ];

		const paragraph2 = new Paragraph( "" );
		paragraph2.startIndex = 22;
		paragraph2.endIndex = 25;
		paragraph2.text = "Tea";

		const structuredNode = new StructuredNode( "section" );
		structuredNode.startIndex = 22;
		structuredNode.endIndex = 44;
		structuredNode.children = [ paragraph2 ];

		const listItem2 = new ListItem();
		listItem2.startIndex = 19;
		listItem2.endIndex = 50;
		listItem2.children = [ structuredNode ];

		const list = new List( false );
		list.startIndex = 0;
		list.endIndex = 50;
		list.children = [ listItem1, listItem2 ];

		const expected = new StructuredNode();
		expected.startIndex = 0;
		expected.endIndex = 55;
		expected.children = [ list ];

		console.log( printTree( tree ).join( "\n" ) );
		// expect(  JSON.stringify( tree ) ).toEqual( JSON.stringify( expected ) );
	} );


	it( "can parse an HTML text into a StructuredNode with embedded children", () => {
		const input = "<section><div>This sentence. Another sentence.</div></section>";

		const tree = buildTree( input );

		const paragraph = new Paragraph( "" );
		paragraph.startIndex = 14;
		paragraph.endIndex = 46;
		paragraph.text = "This sentence. Another sentence.";

		const structuredNode = new StructuredNode( "div" );
		structuredNode.startIndex = 9;
		structuredNode.endIndex = 52;
		structuredNode.children = [ paragraph ];

		const expected = new StructuredNode( "section" );
		expected.startIndex = 0;
		expected.endIndex = 62;
		expected.children = [ structuredNode ];

		console.log( printTree( tree ).join( "\n" ) );
		// expect(  JSON.stringify( tree ) ).toEqual( JSON.stringify( expected ) );
	} );

	it( "can parse an HTML text into a StructuredNode with a few siblings", () => {
		const input = "<section><h1>First heading</h1><p>This sentence. Another sentence.</p></section>";

		const tree = buildTree( input );

		const heading = new Heading( 1 );
		heading.startIndex = 9;
		heading.endIndex = 31;
		heading.text = "First heading";

		const paragraph = new Paragraph( "" );
		paragraph.startIndex = 31;
		paragraph.endIndex = 70;
		paragraph.text = "This sentence. Another sentence.";

		const expected = new StructuredNode( "section" );
		expected.startIndex = 0;
		expected.endIndex = 62;
		expected.children = [ heading, paragraph ];

		console.log( printTree( tree ).join( "\n" ) );
		// expect(  JSON.stringify( tree ) ).toEqual( JSON.stringify( expected ) );
	} );
} );
