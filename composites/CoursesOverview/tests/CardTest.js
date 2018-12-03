import React from "react";
import renderer from "react-test-renderer";
import Card, { FullHeightCard } from "../Card";
import CardDetails from "../CardDetails";

test( "The empty Card component matches the snapshot", () => {
	const component = renderer.create(
		<Card />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "The FullHeightCard is rendered including some props", () => {
	const component = renderer.create(
		<FullHeightCard className={ "CourseCard_Empty" } id={ "Test01" } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "The FullHeightCard is rendered including the CardBanner and CardDetails components", () => {
	const course = {
		title: "Keyword Research",
		image: "../wp-content/plugins/wordpress-seo/images/sample_course_card_header.png",
		description: "Do you know the essential first step of good SEO? It’s keyword research. In this training, \n" +
		             "you’ll learn how to research and select the keywords that will guide searchers to your pages.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
		banner: {
			text: "Free trial available",
		},
	};
	const header = {
		image: course.image,
		title: course.title,
		link: course.courseUrl,
	};

	const component = renderer.create(
		<FullHeightCard
			className={ "CourseCard" }
			id={ "Test02" }
			header={ header }
			banner={ course.banner }
		>
			<CardDetails
				title={ course.title }
				description={ course.description }
				courseUrl={ course.courseUrl }
				shopUrl={ course.shopUrl }
			/>
		</FullHeightCard>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

