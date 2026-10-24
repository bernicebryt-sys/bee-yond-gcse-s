const coreSubjects = ['English Language', 'English Literature', 'Maths', 'Computer Science'];
const optionSubjects = ['Art', 'Photography', 'History', 'Geography', 'Food Technology', 'Design & Technology', 'Religious Education', 'French', 'Spanish', 'Music', 'Drama'];
const scienceSubjects = ['Biology', 'Chemistry', 'Physics'];
const subjects = [...coreSubjects, ...scienceSubjects, ...optionSubjects];
let studentProfile = safeRead('studyroom-profile', null);
let socialProfile = safeRead('revise-rise-social', { username: 'Learner', friends: [], avatar: '🙂', avatarColor: '#5f8a72', accessory: '', inventory: [], examBoards: {} });
socialProfile = { username: 'Learner', friends: [], avatar: '🙂', avatarColor: '#5f8a72', accessory: '', inventory: [], examBoards: {}, ...socialProfile };
socialProfile.friends = Array.isArray(socialProfile.friends) ? socialProfile.friends : [];
socialProfile.inventory = Array.isArray(socialProfile.inventory) ? socialProfile.inventory : [];
socialProfile.examBoards ||= {};
let flightSession = null;
let flightInterval = null;
let breakInterval = null;
let breakSecondsLeft = 120;

const examBoards = ['AQA', 'Pearson Edexcel', 'OCR', 'WJEC / Eduqas'];
const avatarFaces = ['🙂', '😎', '🤓', '😺', '🐼', '🦊', '🐸', '🐨'];
const avatarColors = ['#5f8a72', '#d27860', '#537f9b', '#aa79a0', '#bc9546', '#477c7b'];
const shopItems = [
	{ id: 'leaf-crown', name: 'Leaf crown', icon: '🌿', cost: 15 },
	{ id: 'star-clip', name: 'Star clip', icon: '✨', cost: 25 },
	{ id: 'round-glasses', name: 'Round glasses', icon: '👓', cost: 30 },
	{ id: 'headphones', name: 'Headphones', icon: '🎧', cost: 40 },
	{ id: 'pilot-wings', name: 'Pilot wings', icon: '🪽', cost: 60 }
];

const questions = [
	{ subject: 'Biology', year: 2025, topic: 'Cell biology', prompt: 'Which cell structure is the main site of aerobic respiration?', options: ['Ribosome', 'Mitochondrion', 'Nucleus', 'Cell membrane'], answer: 1, explanation: 'Mitochondria are where most aerobic respiration takes place. The process releases energy from glucose using oxygen.' },
	{ subject: 'Chemistry', year: 2025, topic: 'Particles and mixtures', prompt: 'A student separates coloured dyes in ink using paper chromatography. What does a dye that travels furthest suggest?', options: ['It is more soluble in the solvent than the dyes that travel less far.', 'It has the largest atoms.', 'It has the highest melting point.', 'It cannot dissolve in the solvent.'], answer: 0, explanation: 'A dye that is more soluble in the mobile solvent is carried further up the paper. Separation depends on how each dye partitions between the solvent and the paper.' },
	{ subject: 'Physics', year: 2025, topic: 'Energy', prompt: 'A 2 kg object is lifted 3 m. Taking gravitational field strength as 10 N/kg, what is its gain in gravitational potential energy?', options: ['6 J', '15 J', '60 J', '600 J'], answer: 2, explanation: 'Use GPE = mass × gravitational field strength × height: 2 × 10 × 3 = 60 J.' },
	{ subject: 'Computer Science', year: 2025, topic: 'Algorithms', prompt: 'A program checks whether each item in an unsorted list matches a target, one item at a time. Which search algorithm is being used?', options: ['Binary search', 'Linear search', 'Bubble sort', 'Merge sort'], answer: 1, explanation: 'Linear search checks items in sequence. Binary search repeatedly halves a sorted list, so it cannot be applied this way to an unsorted list.' },
	{ subject: 'English Language', year: 2024, topic: 'Language analysis', prompt: 'A writer describes a storm as “the sky clenched its dark fists”. Which technique is most clearly used?', options: ['Personification', 'Direct address', 'Statistics', 'Onomatopoeia'], answer: 0, explanation: 'The sky is given the human action of clenching fists, which is personification. The image also creates a threatening tone.' },
	{ subject: 'English Literature', year: 2024, topic: 'Character and theme', prompt: 'When analysing how a character changes across a play, which approach best supports a clear interpretation?', options: ['Retell the entire plot in order.', 'Select short quotations from different moments and explain their effect.', 'List every stage direction.', 'Describe whether you like the character.'], answer: 1, explanation: 'A developed response selects evidence from across the text and explains how the character and writer’s choices change. Plot summary alone does not analyse.' },
	{ subject: 'Maths', year: 2024, topic: 'Ratio', prompt: 'A drink is made with squash and water in the ratio 1:4. How much water is needed for 150 ml of squash?', options: ['37.5 ml', '150 ml', '450 ml', '600 ml'], answer: 3, explanation: 'There are 4 parts of water for every 1 part of squash, so 150 × 4 = 600 ml of water.' },
	{ subject: 'Maths', year: 2025, topic: 'Probability', prompt: 'A fair six-sided die is rolled once. What is the probability of rolling a number greater than 4?', options: ['1/6', '1/3', '1/2', '2/3'], answer: 1, explanation: 'The outcomes greater than 4 are 5 and 6, so there are 2 successful outcomes out of 6 equally likely outcomes: 2/6 = 1/3.' },
	{ subject: 'Maths', year: 2023, topic: 'Area and circumference', prompt: 'A circle has radius 5 cm. What is its circumference in terms of pi?', options: ['5π cm', '10π cm', '20π cm', '25π cm'], answer: 1, explanation: 'Circumference = 2πr. Substituting r = 5 gives 2 × π × 5 = 10π cm.' },
	{ subject: 'Maths', year: 2024, tier: 'foundation', topic: 'Percentages', prompt: 'A jacket costs £80. It is reduced by 15%. What is its sale price?', options: ['£12', '£65', '£68', '£92'], answer: 2, explanation: 'Find 15% of £80: 10% is £8 and 5% is £4, so the reduction is £12. Subtract £12 from £80 to get £68.' },
	{ subject: 'Maths', year: 2025, tier: 'higher', topic: 'Quadratic equations', prompt: 'Which pair of values solves x² − 5x + 6 = 0?', options: ['x = 1 and x = 6', 'x = 2 and x = 3', 'x = −2 and x = −3', 'x = 0 and x = 5'], answer: 1, explanation: 'Factorise: x² − 5x + 6 = (x − 2)(x − 3). Setting each bracket to zero gives x = 2 or x = 3.' },
	{ subject: 'Art', year: 2024, topic: 'Artist research', prompt: 'A student is developing a personal response to an artist. Which is the strongest next step?', options: ['Copy the artist’s finished work exactly.', 'Experiment with one technique and record what changes in their own study.', 'Write only the artist’s birth date.', 'Discard all earlier experiments.'], answer: 1, explanation: 'A personal response shows investigation and development: test a relevant technique, record the outcome, and explain how it informs your own work.' },
	{ subject: 'Photography', year: 2025, topic: 'Exposure', prompt: 'A photographer wants a moving cyclist to appear sharp in a bright scene. Which camera adjustment is most likely to help?', options: ['Use a faster shutter speed.', 'Use a slower shutter speed.', 'Increase the exposure time.', 'Use a wider aperture and a slower shutter speed.'], answer: 0, explanation: 'A faster shutter speed reduces the time light reaches the sensor, helping freeze motion. In bright conditions there is more light available, making a fast shutter speed easier to use.' },
	{ subject: 'Photography', year: 2023, topic: 'Composition', prompt: 'A photographer places the main subject off-centre along a grid line to create a balanced image. Which compositional guideline are they using?', options: ['Rule of thirds', 'Leading lines', 'Shallow depth of field', 'High-key lighting'], answer: 0, explanation: 'The rule of thirds divides a frame into a 3 by 3 grid and places important subjects near the lines or their intersections.' },
	{ subject: 'History', year: 2024, topic: 'Using evidence', prompt: 'A historian compares two accounts written at different times about the same event. What is the most useful first step?', options: ['Assume the oldest account is always correct.', 'Compare the authors’ purpose, audience and context.', 'Choose the account with the most dramatic language.', 'Ignore evidence that disagrees with the preferred account.'], answer: 1, explanation: 'Provenance helps explain why accounts differ. Compare who made each source, when, for whom and for what purpose, then test claims against other evidence.' },
	{ subject: 'Geography', year: 2024, topic: 'Fieldwork', prompt: 'A class measures river width at several points along a reach. Why should they repeat measurements?', options: ['To make the river wider.', 'To identify anomalies and calculate a more reliable mean.', 'To avoid recording the location.', 'To ensure every result is exactly the same.'], answer: 1, explanation: 'Repeats help spot unusual results and make a mean more representative. Students should keep the method consistent and record any anomalies.' },
	{ subject: 'Religious Education', year: 2023, topic: 'Evaluating viewpoints', prompt: 'Which response best evaluates a religious or ethical argument?', options: ['State one opinion without a reason.', 'Explain a viewpoint, support it with a reason, then consider a counterargument.', 'List facts without linking them to the question.', 'Repeat the question as the conclusion.'], answer: 1, explanation: 'A balanced evaluation explains and supports a viewpoint, considers a different perspective, and reaches a reasoned conclusion that answers the question.' },
	{ subject: 'Food Technology', year: 2024, topic: 'Food safety', prompt: 'Why should raw chicken be kept separate from ready-to-eat food?', options: ['To prevent cross-contamination by harmful bacteria.', 'To make the chicken cook faster.', 'To preserve the colour of the packaging.', 'To remove the need to wash hands.'], answer: 0, explanation: 'Raw chicken may carry harmful bacteria. Keep it and its utensils separate from ready-to-eat foods, wash hands, and cook it thoroughly.' },
	{ subject: 'Design & Technology', year: 2024, topic: 'Design process', prompt: 'A designer builds a quick model of a product before making the final version. What is the main purpose?', options: ['To test ideas and find problems early.', 'To avoid considering the user.', 'To prove the first idea cannot change.', 'To replace all evaluation.'], answer: 0, explanation: 'A prototype lets a designer test form, function and usability, gather feedback, and improve the design before making a final product.' },
	{ subject: 'French', year: 2024, topic: 'French grammar', prompt: 'In the phrase “Je joue au tennis”, what does “au” represent?', options: ['à + le', 'à + la', 'de + les', 'a past-tense ending'], answer: 0, explanation: 'Au is the contraction of à + le. French combines these words before a masculine singular noun; some activities use jouer à.' },
	{ subject: 'Spanish', year: 2024, topic: 'Spanish future', prompt: 'What does “Voy a estudiar” mean?', options: ['I studied.', 'I am going to study.', 'I study every day.', 'I would study.'], answer: 1, explanation: 'Voy is the “I” form of ir. Ir + a + infinitive expresses a near-future plan, so voy a estudiar means “I am going to study”.' },
	{ subject: 'English Literature', year: 2024, topic: 'Poetry comparison', prompt: 'When comparing two poems, what makes a point of comparison well supported?', options: ['Name one shared theme and move on.', 'Connect evidence from both poems and explain the writers’ different choices.', 'Retell both poems in full.', 'Discuss only the poem you prefer.'], answer: 1, explanation: 'A comparison links both texts throughout. Use precise evidence from each poem and explain how language, form or structure creates similarities or contrasts.' },
	{ subject: 'English Literature', year: 2025, topic: 'A Christmas Carol', prompt: 'How does Scrooge’s response to the spirits help develop a central idea in A Christmas Carol?', options: ['It shows that people cannot change.', 'It allows Dickens to explore change, responsibility and the possibility of redemption.', 'It proves the Cratchits are wealthy.', 'It removes the need for a narrator.'], answer: 1, explanation: 'Scrooge’s changing responses let Dickens explore personal transformation and social responsibility. Support an interpretation with moments from across the novella.' },
	{ subject: 'English Literature', year: 2024, topic: 'Romeo and Juliet', prompt: 'Why might a director emphasise the contrast between love and conflict in Romeo and Juliet?', options: ['To show how the feud shapes the lovers’ choices and the tragedy.', 'To prove the play has no conflict.', 'To remove the effect of the families.', 'To make the setting irrelevant.'], answer: 0, explanation: 'The public feud and private relationship collide throughout the play. A strong reading connects dramatic choices to how conflict shapes the lovers’ decisions and the tragic ending.' },
	{ subject: 'English Literature', year: 2025, topic: 'Macbeth', prompt: 'How does Shakespeare make ambition significant in Macbeth?', options: ['Ambition is mentioned once and has no consequences.', 'The Macbeths’ choices show ambition interacting with persuasion, power and guilt.', 'The witches make every decision for Macbeth.', 'The play avoids showing consequences.'], answer: 1, explanation: 'Track ambition through the characters’ decisions and their consequences. Shakespeare also connects it to power, conscience, gender expectations and disorder.' },
	{ subject: 'Music', year: 2024, topic: 'Musical elements', prompt: 'A passage becomes louder while keeping the same tempo. Which musical element has changed?', options: ['Dynamics', 'Tempo', 'Texture', 'Pitch'], answer: 0, explanation: 'Dynamics describe how loud or quiet music is. A gradual increase in loudness is a crescendo; the tempo is the speed of the pulse.' },
	{ subject: 'Drama', year: 2024, topic: 'Performance intention', prompt: 'A performer pauses before delivering an important line. What should an evaluation explain?', options: ['Only that a pause happened.', 'How the pause communicates an intention and affects the audience.', 'The actor’s costume brand.', 'Why the script should be ignored.'], answer: 1, explanation: 'A useful evaluation links the performance choice to the actor’s intention and its effect on the audience, using precise moments from the performance.' },
	{ subject: 'Biology', year: 2024, tier: 'foundation', topic: 'Osmosis', prompt: 'A potato strip becomes firmer after being placed in pure water. What has moved into its cells?', options: ['Oxygen by active transport', 'Water by osmosis', 'Glucose by respiration', 'Starch by diffusion'], answer: 1, explanation: 'Water moves into the potato cells through partially permeable membranes by osmosis, making the cells more turgid and the strip firmer.' },
	{ subject: 'Biology', year: 2025, tier: 'higher', topic: 'Inheritance', prompt: 'Both parents are heterozygous for a recessive allele (Aa). What is the probability that their child is aa?', options: ['0%', '25%', '50%', '75%'], answer: 1, explanation: 'The possible allele combinations are AA, Aa, Aa and aa. One of four is aa, so the probability is 1/4 or 25%.' },
	{ subject: 'Chemistry', year: 2024, tier: 'foundation', topic: 'Acids and alkalis', prompt: 'What is the pH of a neutral solution at room temperature?', options: ['0', '3', '7', '14'], answer: 2, explanation: 'At room temperature, a neutral solution has pH 7. Acids have pH below 7 and alkalis have pH above 7.' },
	{ subject: 'Chemistry', year: 2025, tier: 'higher', topic: 'Amounts of substance', prompt: 'How many moles are in 12 g of carbon? (Aᵣ of carbon = 12)', options: ['0.5 mol', '1 mol', '12 mol', '144 mol'], answer: 1, explanation: 'Moles = mass ÷ relative atomic mass. 12 g ÷ 12 = 1 mol.' },
	{ subject: 'Physics', year: 2024, tier: 'foundation', topic: 'Speed', prompt: 'A runner travels 100 m in 20 s. What is their average speed?', options: ['0.2 m/s', '5 m/s', '20 m/s', '2,000 m/s'], answer: 1, explanation: 'Average speed = distance ÷ time = 100 m ÷ 20 s = 5 m/s.' },
	{ subject: 'Physics', year: 2025, tier: 'higher', topic: 'Electric circuits', prompt: 'A 12 V supply is connected to a 4 Ω resistor. What current flows?', options: ['0.33 A', '3 A', '8 A', '48 A'], answer: 1, explanation: 'Use V = IR and rearrange to I = V ÷ R. So I = 12 ÷ 4 = 3 A.' },
	{ subject: 'Biology', year: 2023, topic: 'Organisation', prompt: 'Why does increasing the surface area of the alveoli help gas exchange?', options: ['It reduces the distance oxygen has to travel to the blood.', 'It provides a larger area for diffusion to happen.', 'It makes the lungs produce oxygen.', 'It stops carbon dioxide dissolving.'], answer: 1, explanation: 'A large alveolar surface area allows more oxygen and carbon dioxide to diffuse at the same time, increasing the rate of gas exchange.' },
	{ subject: 'Chemistry', year: 2023, topic: 'Atomic structure', prompt: 'An atom has 11 protons and 12 neutrons. What is its mass number?', options: ['1', '11', '12', '23'], answer: 3, explanation: 'Mass number is the total number of protons and neutrons: 11 + 12 = 23.' },
	{ subject: 'Physics', year: 2023, topic: 'Electricity', prompt: 'A current of 2 A flows through a 6 Ω resistor. What is the potential difference across it?', options: ['0.33 V', '3 V', '8 V', '12 V'], answer: 3, explanation: 'Ohm’s law gives potential difference = current × resistance: V = 2 × 6 = 12 V.' },
	{ subject: 'Computer Science', year: 2023, topic: 'Data representation', prompt: 'How many different values can be represented by 3 bits?', options: ['3', '6', '8', '16'], answer: 2, explanation: 'Each bit has 2 possible states, so 3 bits represent 2³ = 8 different values.' },
	{ subject: 'Biology', year: 2025, type: 'written', maxMarks: 4, topic: 'Organisation', prompt: 'Explain how alveoli are adapted for gas exchange.', keywordGroups: [['large surface area', 'surface area'], ['thin walls', 'one cell thick', 'short diffusion distance'], ['concentration gradient', 'steep gradient'], ['diffusion', 'oxygen', 'carbon dioxide']], modelAnswer: 'Alveoli provide a large surface area. Their thin walls give a short diffusion distance, and ventilation plus blood flow maintain a concentration gradient so oxygen and carbon dioxide diffuse rapidly.' },
	{ subject: 'Chemistry', year: 2025, type: 'written', maxMarks: 6, topic: 'Particles and mixtures', prompt: 'Describe how paper chromatography can separate and help identify dyes in an ink mixture.', keywordGroups: [['pencil baseline', 'baseline in pencil'], ['spot of ink', 'ink spot'], ['solvent below', 'above the solvent'], ['solvent moves up', 'solvent travels up'], ['different solubility', 'different attractions'], ['compare with reference', 'compare rf', 'identify the dye']], modelAnswer: 'Draw a pencil baseline and place a small ink spot on it. Stand the paper in solvent with the spot above the liquid. The solvent moves up the paper; dyes travel different distances because they have different solubilities and attractions to the paper. Compare the separated pattern or Rf values with known dyes.' },
	{ subject: 'Physics', year: 2025, type: 'written', maxMarks: 4, topic: 'Energy', prompt: 'Describe the energy transfer when a ball is lifted and then released.', keywordGroups: [['chemical energy', 'energy store in muscles'], ['gravitational potential', 'gpe store'], ['kinetic energy', 'movement'], ['thermal', 'sound', 'dissipated', 'surroundings']], modelAnswer: 'Chemical energy in the person’s muscles is transferred to the ball’s gravitational potential energy store as it is lifted. When released, this store transfers to kinetic energy. Some energy is dissipated to the surroundings as thermal energy and sound.' },
	{ subject: 'English Literature', year: 2025, type: 'written', maxMarks: 8, topic: 'A Christmas Carol', prompt: 'How does Dickens present Scrooge’s change in A Christmas Carol?', keywordGroups: [['initially isolated', 'isolated at first', 'miser'], ['first stave', 'beginning'], ['ghost', 'spirits'], ['past', 'present', 'future'], ['cratchit', 'tiny tim', 'family'], ['transformation', 'changes', 'becomes'], ['redemption', 'generosity'], ['social responsibility', 'poverty', 'context']], modelAnswer: 'At the beginning of the novella, Dickens presents Scrooge as isolated and miserly. The Ghosts of Christmas Past, Present and Yet to Come make him confront the effects of his choices, including the Cratchit family’s hardship. His transformation into a generous man suggests redemption is possible. Dickens uses Scrooge’s change to encourage social responsibility towards the poor.' }
];

const practicals = [
	{ subject: 'BIOLOGY', time: '15 MIN', title: 'Do leaves lose water?', intro: 'Compare how quickly water evaporates from leaves with different surface areas.', materials: 'A leafy sprig, clear bag, elastic band, timer. Ask an adult before collecting a plant.', steps: ['Cover a leafy sprig loosely with a clear bag and secure it around the stem.', 'Place it in a bright, warm spot and check for droplets after 15 minutes.', 'Compare with a similar bag around a bare stem as a control.'], result: 'Water droplets suggest transpiration: water vapour left the leaves and condensed on the bag. A bare-stem control helps show where the water came from.' },
	{ subject: 'CHEMISTRY', time: '20 MIN', title: 'Separate ink colours', intro: 'Use paper chromatography to investigate the pigments in washable felt-tip ink.', materials: 'Washable felt-tip pens, kitchen paper, a glass, water, pencil. Adult help recommended.', steps: ['Cut a strip of kitchen paper. Draw a small ink spot near the bottom in pencil.', 'Stand the strip in a little water, keeping the ink spot above the waterline.', 'Watch the water climb. Remove the paper when it nears the top and let it dry.'], result: 'Different pigments travel at different speeds. More soluble pigments usually move further with the water. Do not use permanent markers or drink the water.' },
	{ subject: 'PHYSICS', time: '10 MIN', title: 'Test sound and distance', intro: 'Explore how the loudness of a sound changes as you move further away.', materials: 'A phone playing a quiet steady tone, measuring tape, adult helper. Keep volume low.', steps: ['Place the phone at one end of a room and set the volume low.', 'Stand 1 m away, then 2 m and 3 m away. Keep the phone volume fixed.', 'Record how loud it seems at each distance. Repeat and compare.'], result: 'Sound intensity generally decreases as distance from the source increases. Your ears give subjective results, so a sound meter app can make the comparison more repeatable.' },
	{ subject: 'BIOLOGY', time: '15 MIN', title: 'Which material insulates best?', intro: 'Compare how quickly warm water cools when wrapped in different materials.', materials: 'Two mugs, warm (not boiling) water, fabric/paper/foil, kitchen thermometer. Adult supervision.', steps: ['Ask an adult to pour equal amounts of warm water into two matching mugs.', 'Wrap one mug in a chosen material; leave the other uncovered as a control.', 'Measure the temperature of both mugs after 10 minutes. Repeat with other materials.'], result: 'The better insulator should reduce energy transfer to the surroundings, so its water stays warmer. Keep starting volume and temperature the same for a fair test.' }
	,
	{ subject: 'CHEMISTRY · PHYSICS', time: '10 MIN', title: 'Build a bubbling lava lamp', intro: 'Watch coloured water droplets rise and fall through oil as gas bubbles form.', materials: 'Clear glass, water, cooking oil, food colouring, one small piece of fizzy antacid tablet. Adult supervision. Do not seal or drink the mixture.', steps: ['Pour water into the glass until it is about one quarter full; add a few drops of colouring.', 'Slowly add cooking oil, leaving space at the top. Wait for the layers to settle.', 'With an adult, add one small piece of tablet and observe. Never put a lid on the glass.'], result: 'Oil and water form separate layers because they have different properties. The tablet reacts in water and releases carbon dioxide; bubbles carry coloured water upward, then it sinks again when the gas escapes.' },
	{ subject: 'CHEMISTRY', time: '20 MIN', title: 'Make a colour-changing pH indicator', intro: 'Use red cabbage water to compare the acidity of familiar, safe household liquids.', materials: 'Red cabbage, warm water prepared by an adult, clear cups, small samples of vinegar and bicarbonate-of-soda solution. Do not taste or mix with cleaners.', steps: ['Ask an adult to soak chopped red cabbage in warm water, then cool and strain the purple liquid.', 'Pour small amounts into separate labelled cups and add a little vinegar or bicarbonate solution.', 'Record each colour. Keep the samples separate and wash hands afterwards.'], result: 'Red cabbage pigment changes colour with acidity. Vinegar is acidic and bicarbonate solution is weakly alkaline. This is an approximate indicator, not a precise pH measurement.' },
	{ subject: 'PHYSICS', time: '10 MIN', title: 'Investigate static electricity', intro: 'Test how a charged balloon can attract tiny pieces of paper.', materials: 'Balloon, small paper scraps, wool or dry hair. Keep balloons away from faces and electronics; do not use near flames.', steps: ['Tear paper into tiny pieces and spread them on a dry table.', 'Rub an inflated balloon on wool or dry hair for about ten seconds.', 'Hold the balloon near the paper without touching it and observe. Repeat with an unrubbed balloon.'], result: 'Rubbing transfers electric charge. The charged balloon can polarise nearby paper and attract it. Comparing with an unrubbed balloon gives you a simple control.' },
	{ subject: 'PHYSICS · DESIGN & TECHNOLOGY', time: '15 MIN', title: 'Build a paper bridge', intro: 'Find out how folding changes the strength of a paper bridge.', materials: 'Two books, paper, a small cup and coins. Keep the bridge low over a table.', steps: ['Place two books a short distance apart and lay a flat sheet of paper across them.', 'Add coins one at a time to a cup in the middle; record how many it holds.', 'Fold a new sheet into a concertina and repeat with the same book gap and coins.'], result: 'Folds change the shape and stiffness of the paper, spreading a load differently. Repeat each test and keep the span and paper type the same for a fair comparison.' },
	{ subject: 'DESIGN & TECHNOLOGY', time: '25 MIN', title: 'Prototype a cardboard phone stand', intro: 'Design a stable stand from packaging card, then test how well it holds a phone at a useful viewing angle.', materials: 'Clean cereal-box card, pencil, ruler, masking tape and child-safe scissors. Ask an adult to help with cutting. No craft knives or hot glue.', steps: ['Sketch a side view and mark a base, back support and small front lip on the card.', 'Cut and fold the card with adult help. Use tape to hold the first prototype together.', 'Test it on a flat table with a phone-sized object. Change one part if it slips or tips.'], result: 'A wider base and triangular support can improve stability. Evaluate the prototype against the user need: does it hold the device, stay upright and allow a clear view? Keep devices away from table edges.' },
	{ subject: 'DESIGN & TECHNOLOGY', time: '20 MIN', title: 'Make a recycled desk organiser', intro: 'Turn clean packaging tubes and a small box into a desk organiser, designing the layout for items you actually use.', materials: 'Clean cardboard tubes or small cartons, scrap card, tape or glue stick, ruler, pencils and child-safe scissors. Adult help with cutting.', steps: ['List three items the organiser should hold and measure their approximate sizes.', 'Arrange the clean tubes inside a small box. Sketch and label your layout before fixing it.', 'Test the layout with the items. Record one improvement for stability or access.'], result: 'A useful design fits its user and contents. Compare the prototype with your measurements, check that it does not tip and explain one change you would make in a stronger final material.' },
	{ subject: 'DESIGN & TECHNOLOGY', time: '15 MIN', title: 'Design a protective paper package', intro: 'Explore how folds and layers protect a lightweight object in a small drop test.', materials: 'Scrap paper, card, masking tape, one cotton ball, a ruler and a small box. Ask an adult to supervise. Drop only from a low height over a clear floor.', steps: ['Draw a simple package for the cotton ball and label the parts that should absorb impact.', 'Build a paper-and-card prototype using folds and a few pieces of tape.', 'Drop it from the same low height onto a clear floor three times. Open it and inspect the cotton ball.'], result: 'Crumple zones and folded layers can spread or absorb impact. Keep the drop height and test object the same each time, then evaluate protection, material use and ease of opening.' }
];

const codeStarter = `<!doctype html>
<html>
<head>
	<style>
		body { font-family: sans-serif; padding: 24px; background: #eff4ed; }
		h1 { color: #315844; }
		.card { padding: 18px; border-radius: 8px; background: white; }
	</style>
</head>
<body>
	<div class="card">
		<h1>Hello, revision!</h1>
		<p>I made this little page with HTML and CSS.</p>
	</div>
</body>
</html>`;

const viewNames = { home: 'OVERVIEW', curriculum: 'STUDY GUIDES', practice: 'QUESTION BANK', practicals: 'SCIENCE LAB', codelab: 'CODE STUDIO', notes: 'MY NOTES', streak: 'DAILY STREAK', flight: 'STUDY FLIGHT', friends: 'FRIENDS & CREW', profile: 'AVATAR & ACCOUNT', artstudio: 'DIGITAL ART', photostudio: 'PHOTO STUDIO', musicstudio: 'MUSIC STUDIO', dramastudio: 'DRAMA STUDIO', helper: 'REVISION HELPER', settings: 'APPEARANCE' };
let currentView = 'home';
let activeQuestionSubject = 'all';
let currentNoteId = null;
let activeNoteFolder = 'all';
let noteSaveTimer;
let activeYearGroup = studentProfile?.yearGroup || '10';

const studyTips = {
	'English Language': 'Annotate the question first. Select short evidence, then explain the effect of a word or structural choice.',
	'English Literature': 'Learn a few flexible quotations. Link each one to the writer’s choices, context and a clear interpretation.',
	Maths: 'Show each step, keep units visible and check whether your answer is reasonable. Practise both calculator and non-calculator methods.',
	'Religious Education': 'Explain the belief, support it with a teaching or reason, then weigh a different view before your conclusion.',
	'Computer Science': 'Trace algorithms by hand in a table. For programming questions, name the inputs, process and expected output.',
	Biology: 'Practise precise key terms, label diagrams clearly and link each step in a biological process to its result.',
	Chemistry: 'Balance equations carefully, show working for calculations and state the conditions when describing practical methods.',
	Physics: 'Write the equation first, substitute values with units, then check the unit and scale of your answer.',
	Art: 'Keep a visual journey: collect relevant references, try several materials, annotate what worked and develop one idea into your own response.',
	Photography: 'Make contact sheets, change one camera setting at a time and annotate how light, framing and focus support your intention.',
	History: 'Build a timeline before writing. Support each claim with precise evidence and explain why events caused change or continuity.',
	Geography: 'Use named examples and data. For fieldwork, revise your question, sampling method, variables, results and evaluation.',
	'Food Technology': 'Connect each design choice to the user and nutrition brief. Revise food safety, cooking methods and sensory testing.',
	'Design & Technology': 'Annotate iterative prototypes. Explain material and process choices in relation to function, user needs and sustainability.',
	French: 'Build flexible answers with opinions and reasons. Check noun gender, adjective agreement and verb endings, and practise changing the tense.',
	Spanish: 'Use familiar cognates carefully, then add opinions, reasons and time phrases. Check adjective agreement and practise more than one tense.',
	Music: 'Listen actively for rhythm, pitch, tempo, texture and dynamics. Support descriptions with precise musical vocabulary and examples.',
	Drama: 'Connect performance choices to intention and audience impact. Evaluate voice, movement, space and interaction using specific moments.',
};

const subjectTopicGuides = {
	'English Language': [['Language analysis', 'Identify a word or phrase, explain its associations and connect its effect to the writer’s purpose. Support each point with short, precise evidence.'], ['Structure and viewpoint', 'Track how focus, pace, contrast and narrative perspective change across a text. Explain how those choices guide the reader.'], ['Creative writing', 'Plan a clear beginning, development and ending. Vary sentence forms deliberately, use precise details and proofread punctuation.'], ['Transactional writing', 'Match purpose, audience and form. Build a clear line of argument, organise paragraphs and choose a register that suits the reader.'], ['Comparing non-fiction', 'Compare writers’ viewpoints and methods using evidence from both texts. Explain similarities and differences rather than listing them.'], ['Spoken language', 'Plan a focused presentation, support ideas with examples and adapt vocabulary, pace and tone for listeners.']],
	'English Literature': [['A Christmas Carol', 'Track Scrooge’s movement from isolation to generosity. Connect the visits of the spirits to Dickens’s ideas about poverty, social responsibility, family and redemption.'], ['Romeo and Juliet', 'Follow the lovers and the feud across the play. Explore how dramatic irony, imagery, contrast and stagecraft develop love, conflict and tragedy.'], ['Macbeth', 'Trace Macbeth’s choices and their consequences. Consider how ambition, persuasion, guilt and disorder are shaped through language and stagecraft.'], ['Poetry comparison', 'Compare the poets’ ideas and methods throughout. Use concise evidence from both poems and explain how imagery, form, sound or structure creates contrast or connection.'], ['Unseen poetry', 'Read the poem twice: first for its overall meaning, then for patterns in language, form and structure. Build an interpretation from precise details.'], ['Character and theme', 'Follow a character or theme across the whole text. Select brief quotations and analyse the writer’s choices instead of retelling the plot.']],
	Maths: [['Number and accuracy', 'Practise fractions, decimals, percentages, ratio, powers, standard form, bounds and rounding. Keep units and calculator accuracy in mind.'], ['Ratio and proportion', 'Scale quantities using equivalent ratios. Link ratio to recipes, maps, rates and direct or inverse proportion.'], ['Percentages', 'Find percentage change, reverse percentages and compound growth. Choose a multiplier or a clear written method and check the direction of change.'], ['Algebra', 'Simplify expressions, expand brackets, factorise and rearrange formulae. Show each transformation so errors are easy to spot.'], ['Quadratic equations', 'Solve by factorising, completing the square or using the formula as appropriate. Check solutions by substitution.'], ['Graphs and functions', 'Plot and interpret linear, quadratic and real-life graphs. Connect gradients and intercepts to the situation described.'], ['Geometry and measures', 'Use angle facts, area, volume, constructions, similarity, Pythagoras and trigonometry. Draw a diagram and state units.'], ['Statistics and probability', 'Select suitable averages and charts, interpret distributions and calculate probabilities using tables, lists or diagrams.']],
	'Computer Science': [['Algorithms', 'Trace an algorithm with a dry-run table. Identify sequence, selection and iteration, then compare efficiency for the task.'], ['Programming', 'Break a problem into inputs, processing and outputs. Use variables, selection, loops, procedures and tests to build a solution.'], ['Data representation', 'Revise binary, denary and hexadecimal conversions, text encoding, images, sound and the units used to measure data.'], ['Computer systems', 'Explain how the processor, memory, storage and input/output devices work together to run programs.'], ['Networks and cybersecurity', 'Compare network types and topologies. Explain protocols and threats, then choose suitable prevention methods.']],
	Biology: [['Cell biology', 'Compare animal, plant and bacterial cells. Revise microscopy, specialised cells, transport, mitosis and the role of enzymes.'], ['Organisation', 'Connect cells, tissues, organs and systems. Include digestion, circulation, gas exchange and how structure supports function.'], ['Infection and response', 'Compare pathogens and transmission. Revise body defences, vaccination, antibiotics and how medicines are tested.'], ['Bioenergetics', 'Explain photosynthesis and respiration using word or symbol equations. Link limiting factors to rates and required practicals.'], ['Homeostasis and response', 'Describe how the body maintains stable internal conditions, including hormones, nerves, temperature and blood glucose.'], ['Inheritance and evolution', 'Use genetic diagrams, explain variation and natural selection, and connect evidence to evolution and selective breeding.'], ['Ecology', 'Study ecosystems, sampling, interdependence, cycles, biodiversity and human impacts on the environment.']],
	Chemistry: [['Atomic structure and the periodic table', 'Describe protons, neutrons and electrons, isotopes and electron structure. Connect patterns in the periodic table to properties.'], ['Bonding and properties', 'Compare ionic, covalent and metallic bonding. Link structure and bonding to melting point, conductivity and material properties.'], ['Chemical reactions', 'Balance equations and revise acids, salts, electrolysis, oxidation and conservation of mass.'], ['Energy changes and rates', 'Interpret reaction profiles and collision theory. Explain how temperature, concentration, surface area and catalysts affect rate.'], ['Quantitative chemistry', 'Use formulae, equations, relative masses and the mole relationship. Show working and include units.'], ['Organic chemistry', 'Revise hydrocarbons, crude oil, alkanes, alkenes, polymers and the reactions used to identify them.'], ['Chemical analysis and resources', 'Interpret tests for gases and ions, chromatography and instrumental analysis. Consider potable water and resource use.']],
	Physics: [['Energy', 'Track energy stores and transfers. Use equations for efficiency, power, heating and gravitational potential energy.'], ['Electricity', 'Relate current, potential difference and resistance. Draw circuits and explain series and parallel behaviour.'], ['Particle model', 'Explain density, state changes, internal energy and pressure using particle motion and spacing.'], ['Forces and motion', 'Interpret distance-time and velocity-time graphs. Use resultant force, acceleration, momentum and stopping-distance ideas.'], ['Waves', 'Compare transverse and longitudinal waves. Revise reflection, refraction, sound, the electromagnetic spectrum and wave equations.'], ['Magnetism and electromagnetism', 'Describe fields, motors and generators, and explain how transformers transfer energy.'], ['Atomic physics', 'Compare atomic models and explain radiation, nuclear equations, half-life and uses or risks of radiation.']],
	Art: [['Developing ideas', 'Respond to a theme with sketches, references and annotations that show decisions changing over time.'], ['Artist research', 'Select relevant artists and explain how their visual choices inform experiments in your own work.'], ['Materials and experiments', 'Test media, scale, surface and technique. Record what succeeds and what you would change next.'], ['Visual elements', 'Explore line, shape, tone, colour, texture, pattern and composition to communicate an intention.'], ['Personal outcome', 'Refine experiments into an original outcome that makes your own response clear.'], ['Evaluation', 'Review the outcome against your intentions and support reflections with visual evidence.']],
	Photography: [['Exposure', 'Balance shutter speed, aperture and ISO to control brightness and motion. Change one setting at a time and record the result.'], ['Composition', 'Explore framing, viewpoint, rule of thirds, leading lines and negative space. Choose compositions to support an idea.'], ['Light and colour', 'Notice light direction, quality, contrast and colour relationships. Explain how they affect mood and focus.'], ['Focus and depth of field', 'Use focus distance and aperture to control what appears sharp. Connect this choice to the subject and intention.'], ['Contact sheets and editing', 'Compare a series of images, select with a reason and make edits that strengthen rather than replace the original idea.'], ['Analysis and portfolio', 'Annotate what you intended, the choices you made, what the viewer notices and what you would develop next.']],
	History: [['Evidence and sources', 'Consider who made a source, when, for whom and why. Test its claims against other evidence before judging its value.'], ['Cause and consequence', 'Separate long-term and short-term causes, then explain how they contributed to an event or change.'], ['Change and continuity', 'Compare conditions across periods and support judgements with precise examples.'], ['Historical interpretations', 'Explain why accounts differ by examining evidence, context and purpose rather than choosing one automatically.'], ['Structured explanations', 'Build a clear argument, use accurate evidence and explain how each example supports the question.']],
	Geography: [['Fieldwork enquiry', 'Define a question, choose a sampling method, collect repeatable data and evaluate limitations and improvements.'], ['Physical landscapes', 'Explain processes shaping rivers, coasts or ecosystems and link those processes to landforms and management.'], ['Weather and climate hazards', 'Compare causes, impacts and responses using a named example and evidence.'], ['Urban and human geography', 'Study how places change, who benefits and the challenges of development. Use named examples.'], ['Resources and sustainability', 'Explain how water, energy and food are managed and evaluate trade-offs between people and environments.'], ['Maps, graphs and data', 'Read scales, patterns and anomalies. Use appropriate data to support a geographical conclusion.']],
	'Religious Education': [['Beliefs and teachings', 'Explain a belief accurately, support it with a relevant teaching and show how it influences choices or practice.'], ['Practices', 'Describe how worship, rituals or community life express beliefs, using specific examples.'], ['Ethical arguments', 'Set out a reasoned view, support it with evidence and consider a thoughtful counterargument.'], ['Evaluation', 'Compare viewpoints fairly and reach a conclusion that directly answers the question.']],
	'Food Technology': [['Nutrition and needs', 'Match nutrients and food choices to a user, dietary need and design brief.'], ['Food safety', 'Prevent cross-contamination, use safe temperatures and explain hygiene choices throughout preparation.'], ['Ingredients and functions', 'Explain how ingredients behave during mixing, heating and setting, and how substitutions affect the result.'], ['Cooking and sensory testing', 'Choose suitable processes, test products consistently and use feedback to refine a recipe.']],
	'Design & Technology': [['Design brief and user', 'Identify user needs and measurable design criteria before developing possible solutions.'], ['Materials and properties', 'Compare materials by properties, availability, cost and suitability for the product’s job.'], ['Making and manufacture', 'Select tools and processes safely. Explain how a prototype can test construction and function.'], ['Testing and evaluation', 'Test against design criteria, gather feedback and identify specific improvements.'], ['Sustainability', 'Consider material sourcing, energy, repair, reuse and disposal across a product’s life.']],
	'French': [['Identity and relationships', 'Revise vocabulary and opinions for people, family and everyday life. Build answers with reasons and examples.'], ['French grammar', 'Use articles, adjective agreement, present and past forms, and useful connectives to make flexible sentences.'], ['Future plans', 'Practise near-future and future forms, then adapt them to plans, work, travel and study.'], ['Listening and reading', 'Use context, cognates and tense markers to infer meaning, while checking false friends carefully.'], ['Speaking and writing', 'Extend a response with an opinion, reason, time phrase and a second tense.']],
	'Spanish': [['Identity and relationships', 'Revise vocabulary and opinions for people, family and everyday life. Build answers with reasons and examples.'], ['Spanish grammar', 'Check noun gender, adjective agreement, articles and verb endings when building sentences.'], ['Future plans', 'Use ir + a + infinitive for near-future plans and practise changing the subject accurately.'], ['Listening and reading', 'Use context, cognates and tense markers to infer meaning, while checking false friends carefully.'], ['Speaking and writing', 'Extend a response with an opinion, reason, time phrase and a second tense.']],
	'Music': [['Musical elements', 'Describe pitch, rhythm, tempo, dynamics, texture and timbre with precise listening evidence.'], ['Notation and performance', 'Read relevant notation, practise a part steadily and reflect on accuracy and expression.'], ['Composition', 'Develop a musical idea, structure it clearly and refine it through listening and feedback.'], ['Set works and listening', 'Connect details from listening to musical elements and the context or purpose of the work.']],
	'Drama': [['Performance intention', 'Decide what the audience should understand or feel, then choose performance methods to communicate it.'], ['Voice and movement', 'Use pace, pitch, volume, pause, gesture and posture deliberately and explain their effect.'], ['Space and staging', 'Consider levels, proxemics, entrances, exits and focus when shaping a scene.'], ['Evaluation', 'Refer to a specific moment, explain the choice and evaluate its effect on the audience.']]
};

const topicReadings = {
	'Cell biology': 'Aerobic respiration happens mainly in mitochondria. Cells use oxygen to release energy from glucose; this energy supports processes such as movement, growth and active transport.',
	'Particles and mixtures': 'Paper chromatography separates a mixture because substances have different attractions to the paper and the solvent. A more soluble dye usually travels further with the solvent front.',
	'Energy': 'Gravitational potential energy depends on an object’s mass, its height and the gravitational field strength. Use the equation GPE = mass × gravitational field strength × height, and include joules.',
	'Algorithms': 'Linear search checks each item in sequence until it finds a match or reaches the end. It works on unsorted data; binary search needs ordered data and repeatedly halves the search range.',
	'Language analysis': 'Personification gives a non-human thing a human action or quality. Explain the exact word or image and how it shapes the reader’s impression, rather than naming a technique alone.',
	'Character and theme': 'A strong literature response follows a character or theme across the text. Choose concise quotations and analyse the writer’s choices; connect evidence to the question instead of retelling the plot.',
	'Poetry comparison': 'Compare the poets’ ideas and methods throughout your response. Select concise evidence from both poems, then explain how imagery, form, sound or structure creates a similarity or contrast.',
	'A Christmas Carol': 'Track Scrooge’s change across the novella: his initial isolation, the lessons of the spirits and his later actions. Link Dickens’s choices to responsibility, poverty, generosity and redemption.',
	'Romeo and Juliet': 'Follow how the family feud and the relationship develop across the play. Consider dramatic irony, imagery, contrast and stagecraft, and connect them to the tragedy and its social context.',
	'Macbeth': 'Track Macbeth’s choices and their consequences. Shakespeare develops ambition alongside power, persuasion, guilt and disorder; support each interpretation with evidence from across the play.',
	'Musical elements': 'Dynamics describe volume, tempo describes speed, pitch describes how high or low a sound is, and texture describes how musical layers combine. Listen for changes and name them precisely.',
	'Performance intention': 'A performance choice is strongest when it communicates a clear intention. Explain what the performer did, what meaning it created and how the audience might respond.',
	'Ratio': 'A ratio compares parts in a fixed relationship. In 1:4, every one part of the first quantity matches four parts of the second, so multiply or divide both parts by the same scale factor.',
	'Probability': 'For equally likely outcomes, probability = successful outcomes ÷ total outcomes. Probabilities range from 0 (impossible) to 1 (certain), and can be written as a fraction, decimal or percentage.',
	'Area and circumference': 'A circle’s circumference is the distance around its edge. Use C = 2πr or C = πd; radius is half the diameter, so check which measurement the question gives.',
	'Percentages': 'A percentage is a number of parts per hundred. Find a percentage by converting it to a multiplier or splitting it into useful amounts, then subtract a reduction from the original price.',
	'Quadratic equations': 'A quadratic equation can sometimes be solved by factorising. Find two numbers whose product is the constant term and whose sum is the coefficient of x, then set each bracket equal to zero.',
	'Artist research': 'Artist research should feed into your own making. Select relevant work, identify a technique or idea, experiment with it, annotate what changed and explain how that informs your next personal response.',
	'Exposure': 'Shutter speed controls how long light reaches the sensor. A faster shutter can freeze movement but lets in less light; balance it with aperture and ISO, and test one setting at a time.',
	'Composition': 'The rule of thirds divides a frame into a three-by-three grid. Placing a subject near a line or intersection can create balance, but composition should serve the idea rather than follow a rule automatically.',
	'Using evidence': 'When comparing sources, consider who created each one, when, for whom and why. This context can explain differences; test each claim against other evidence before judging reliability.',
	'Fieldwork': 'Repeated measurements help identify anomalies and calculate a more representative mean. A fair fieldwork method also records location, sampling choices and variables that could affect results.',
	'Evaluating viewpoints': 'A balanced evaluation explains a viewpoint and supports it with a reason, teaching or evidence. Consider a counterargument, then reach a conclusion that answers the exact question.',
	'Food safety': 'Cross-contamination occurs when harmful microbes transfer from raw food to ready-to-eat food. Separate equipment, wash hands and surfaces, and follow safe cooking and storage guidance.',
	'Design process': 'A prototype tests an idea before final manufacture. Use feedback to improve function, appearance and usability, and justify choices against the brief, user needs and material properties.',
	'French grammar': 'In French, nouns have grammatical gender. Articles and many adjectives agree with the noun, while verb endings change with the subject. Learn useful sentence frames, then practise adapting them.',
	'Spanish future': 'One way to talk about a near-future plan in Spanish is ir + a + infinitive. For example, voy a estudiar means “I am going to study”. Change ir to match the subject.',
	'Osmosis': 'Osmosis is the net movement of water through a partially permeable membrane from a more dilute solution to a more concentrated solution. Water entering plant cells makes them more turgid.',
	'Inheritance': 'An allele is a version of a gene. A heterozygous parent with genotype Aa can pass on A or a; a genetic cross lists the possible allele combinations and their probabilities.',
	'Acids and alkalis': 'The pH scale describes acidity and alkalinity. At room temperature, pH 7 is neutral; lower values are acidic and higher values are alkaline.',
	'Amounts of substance': 'The mole links a measurable mass to the number of particles. Calculate moles using amount in moles = mass in grams ÷ relative formula mass (or relative atomic mass for an element).',
	'Speed': 'Average speed tells you how far an object travels per unit time. Use speed = distance ÷ time, and make sure distance and time units match the unit requested.',
	'Electric circuits': 'Current, potential difference and resistance are linked by V = I × R. Rearrange the equation before substituting values, and keep units consistent: volts, amps and ohms.',
	'Atomic structure': 'The mass number is the total number of protons and neutrons in a nucleus. Protons identify the element; electrons have a tiny relative mass and are not included in mass number.',
	'Organisation': 'Alveoli are tiny air sacs with a large combined surface area, thin moist walls and a rich blood supply. These features provide a short diffusion distance and help gases move quickly between air and blood.',
	'Electricity': 'Ohm’s law relates potential difference, current and resistance: V = I × R. Rearrange to find the missing quantity and check the answer’s unit.',
	'Data representation': 'Each binary digit has two possible states, 0 or 1. With n bits there are 2ⁿ possible combinations, so three bits can represent eight different values.'
};

function safeRead(key, fallback) {
	try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function dateKey(date = new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function readProgress() {
	const saved = safeRead('revise-rise-progress', null);
	if (!saved) {
		const firstProgress = { lastActive: '', lastLogin: '', streak: 0, totalAnswered: 0, totalCorrect: 0, totalSeconds: 0, goalMinutes: 30, coins: 300, daily: {}, subjects: {} };
		writeProgress(firstProgress);
		return firstProgress;
	}
	return { lastActive: '', lastLogin: '', streak: 0, totalAnswered: 0, totalCorrect: 0, totalSeconds: 0, goalMinutes: 30, coins: 0, daily: {}, subjects: {}, ...saved };
}

function writeProgress(progress) {
	localStorage.setItem('revise-rise-progress', JSON.stringify(progress));
}

function markStudyDay(progress, key = dateKey()) {
	if (progress.lastActive === key) return;
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	progress.streak = progress.lastActive === dateKey(yesterday) ? progress.streak + 1 : 1;
	progress.lastActive = key;
}

function claimDailyLoginReward() {
	const progress = readProgress();
	const today = dateKey();
	if (progress.lastLogin === today) return;
	progress.lastLogin = today;
	progress.coins += 10;
	writeProgress(progress);
}

function addStudyTime(seconds, subject = null, correct = null) {
	const progress = readProgress();
	const safeSeconds = Math.max(0, Math.min(Math.round(seconds), 3600));
	const key = dateKey();
	markStudyDay(progress, key);
	progress.totalSeconds += safeSeconds;
	progress.daily[key] ||= { seconds: 0, answered: 0, correct: 0 };
	progress.daily[key].seconds += safeSeconds;
	if (subject) {
		progress.subjects[subject] ||= { answered: 0, correct: 0, seconds: 0 };
		progress.subjects[subject].seconds += safeSeconds;
	}
	if (correct !== null) {
		progress.totalAnswered += 1;
		progress.totalCorrect += correct ? 1 : 0;
		progress.daily[key].answered += 1;
		progress.daily[key].correct += correct ? 1 : 0;
		progress.subjects[subject].answered += 1;
		progress.subjects[subject].correct += correct ? 1 : 0;
		if (correct) progress.coins += 10;
	}
	writeProgress(progress);
	if (document.getElementById('view-streak')) renderStreakPage();
	renderLeaderboard();
}

function renderStreakPage() {
	const progress = readProgress();
	const today = progress.daily[dateKey()] || { seconds: 0, answered: 0, correct: 0 };
	const currentStreak = progress.lastActive === dateKey() || progress.lastActive === dateKey(new Date(Date.now() - 86400000)) ? progress.streak : 0;
	document.getElementById('current-streak').textContent = `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`;
	document.getElementById('streak-caption').textContent = currentStreak ? 'One session at a time. Keep your rhythm going.' : 'Answer a question or complete a flight to begin.';
	document.getElementById('today-minutes').textContent = `${Math.floor(today.seconds / 60)} min`;
	document.getElementById('today-goal-status').textContent = `${Math.min(100, Math.round(today.seconds / (progress.goalMinutes * 60) * 100))}% of your ${progress.goalMinutes}-minute goal`;
	document.getElementById('total-questions').textContent = String(progress.totalAnswered);
	document.getElementById('total-correct').textContent = progress.totalAnswered ? `${Math.round(progress.totalCorrect / progress.totalAnswered * 100)}% correct overall` : 'No answers recorded yet.';
	document.getElementById('daily-goal').value = String(progress.goalMinutes);
	const visibleSubjects = getSelectedSubjects().filter((subject) => subject !== 'Combined Science');
	document.getElementById('progress-subjects').innerHTML = visibleSubjects.map((subject) => {
		const stats = progress.subjects[subject] || { answered: 0, correct: 0, seconds: 0 };
		const accuracy = stats.answered ? Math.round(stats.correct / stats.answered * 100) : 0;
		return `<article class="subject-progress"><div><i class="subject-dot ${subjectClass(subject)}"></i><strong>${subject}</strong><span>${stats.answered} ${stats.answered === 1 ? 'question' : 'questions'} · ${Math.floor(stats.seconds / 60)} min</span></div><div class="progress-track"><span style="width:${accuracy}%"></span></div><b>${stats.answered ? `${accuracy}%` : '—'}</b></article>`;
	}).join('') || '<p class="empty-state">Choose your subjects to see your progress here.</p>';
}

function formatClock(totalSeconds) {
	const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
	const seconds = Math.max(0, totalSeconds) % 60;
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderFlight() {
	const destination = document.getElementById('flight-destination').value;
	document.getElementById('map-destination').textContent = destination.split(' · ')[0].toUpperCase();
	const totalSeconds = flightSession?.durationMinutes * 60 || Number(document.getElementById('flight-duration').value) * 60;
	const elapsed = flightSession?.elapsedSeconds || 0;
	const percent = Math.min(100, Math.round(elapsed / totalSeconds * 100));
	document.getElementById('flight-clock').textContent = `${formatClock(elapsed)} / ${formatClock(totalSeconds)}`;
	document.getElementById('flight-route-fill').style.width = `${percent}%`;
	document.getElementById('map-plane').style.left = `${Math.max(4, Math.min(96, percent))}%`;
	document.getElementById('flight-route-caption').textContent = flightSession ? `${destination.split(' · ')[0]} · ${percent}% complete` : 'Choose a route to begin your session.';
	const active = Boolean(flightSession?.active);
	document.getElementById('flight-status').textContent = active ? 'IN THE AIR' : flightSession?.paused ? 'PAUSED AT THE GATE' : 'READY FOR BOARDING';
	document.getElementById('flight-clock-label').textContent = active ? 'ELAPSED · KEEP A COMFORTABLE PACE' : flightSession?.paused ? 'PAUSED · RESUME WHEN READY' : 'READY WHEN YOU ARE';
	document.getElementById('start-flight').disabled = active;
	document.getElementById('start-flight').innerHTML = active ? 'In flight <span>✈</span>' : flightSession?.paused ? 'Resume flight <span>→</span>' : 'Start flight <span>✈</span>';
	document.getElementById('pause-flight').disabled = !active;
	document.getElementById('pause-flight').textContent = 'Pause';
	document.getElementById('end-flight').disabled = !flightSession;
	document.getElementById('flight-destination').disabled = Boolean(flightSession);
	document.getElementById('flight-duration').disabled = Boolean(flightSession);
	renderFlightCrew();
}

function renderFlightCrew() {
	const studying = socialProfile.friends.filter((friend) => friend.studying);
	document.getElementById('flight-crew').innerHTML = studying.map((friend, index) => `<span class="crew-marker" style="--crew-index:${index}" title="${escapeHTML(friend.username)} · locally marked studying">${friend.avatar || '☺'}</span>`).join('');
}

function randomFlight() {
	const select = document.getElementById('flight-destination');
	const available = [...select.options].map((option) => option.value).filter((destination) => destination !== select.value);
	select.value = available[Math.floor(Math.random() * available.length)];
	renderFlight();
}

function startFlight() {
	if (flightSession?.paused) {
		flightSession.paused = false;
		flightSession.active = true;
		flightInterval = setInterval(tickFlight, 1000);
		renderFlight();
		return;
	}
	flightSession = { destination: document.getElementById('flight-destination').value, durationMinutes: Number(document.getElementById('flight-duration').value), elapsedSeconds: 0, segmentSeconds: 0, active: true, paused: false };
	flightInterval = setInterval(tickFlight, 1000);
	renderFlight();
}

function tickFlight() {
	if (!flightSession?.active) return;
	flightSession.elapsedSeconds += 1;
	flightSession.segmentSeconds += 1;
	if (flightSession.segmentSeconds >= 1200 && flightSession.elapsedSeconds < flightSession.durationMinutes * 60) {
		const takeLongBreak = document.getElementById('hourly-break-toggle').checked && flightSession.elapsedSeconds >= 3600 && !flightSession.longBreakTaken;
		flightSession.longBreakTaken ||= takeLongBreak;
		const focusedSeconds = flightSession.segmentSeconds;
		flightSession.segmentSeconds = 0;
		flightSession.active = false;
		flightSession.paused = true;
		clearInterval(flightInterval);
		addStudyTime(focusedSeconds);
		beginPlannedBreak(takeLongBreak ? 600 : 120, takeLongBreak);
	} else if (flightSession.elapsedSeconds >= flightSession.durationMinutes * 60) {
		finishFlight(true);
		return;
	}
	renderFlight();
}

function beginPlannedBreak(duration = 120, longBreak = false) {
	breakSecondsLeft = duration;
	const overlay = document.getElementById('break-overlay');
	overlay.hidden = false;
	document.getElementById('break-title').textContent = longBreak ? 'Take a longer reset.' : 'Time to stretch your wings.';
	document.getElementById('break-description').textContent = longBreak ? 'You have studied for an hour. Take ten minutes away from the screen, or continue whenever you feel ready.' : 'Your 20-minute study block is complete. Take two minutes away from the screen, then continue your flight refreshed.';
	document.getElementById('break-countdown').textContent = formatClock(breakSecondsLeft);
	clearInterval(breakInterval);
	breakInterval = setInterval(() => {
		breakSecondsLeft -= 1;
		document.getElementById('break-countdown').textContent = formatClock(breakSecondsLeft);
		if (breakSecondsLeft <= 0) resumeAfterBreak();
	}, 1000);
}

function resumeAfterBreak() {
	clearInterval(breakInterval);
	document.getElementById('break-overlay').hidden = true;
	if (!flightSession) return;
	flightSession.paused = false;
	flightSession.active = true;
	flightInterval = setInterval(tickFlight, 1000);
	renderFlight();
}

function pauseFlight() {
	if (!flightSession?.active) return;
	clearInterval(flightInterval);
	flightSession.active = false;
	flightSession.paused = true;
	renderFlight();
}

function finishFlight(completed = false) {
	clearInterval(flightInterval);
	clearInterval(breakInterval);
	if (flightSession?.segmentSeconds) addStudyTime(flightSession.segmentSeconds);
	flightSession = null;
	document.getElementById('break-overlay').hidden = true;
	document.getElementById('flight-status').textContent = completed ? 'FLIGHT COMPLETE · WELL DONE' : 'FLIGHT LOGGED';
	renderFlight();
}

function saveSocialProfile() {
	localStorage.setItem('revise-rise-social', JSON.stringify(socialProfile));
}

function badgesForActivity({ streak = 0, answered = 0, correct = 0, minutes = 0 }) {
	const badges = [];
	if (streak >= 7) badges.push(['🔥', '7-day streak']);
	else if (streak >= 3) badges.push(['✦', '3-day streak']);
	if (answered >= 10) badges.push(['📚', '10 questions']);
	if (answered >= 3 && correct / answered >= .8) badges.push(['🎯', 'Sharp focus']);
	if (minutes >= 60) badges.push(['⏱', 'Focused hour']);
	return badges;
}

function renderBadgeChips(badges) {
	return badges.map(([icon, label]) => `<span class="badge-chip" title="${label}">${icon} ${label}</span>`).join('');
}

function renderFriends() {
	document.getElementById('friends-list').innerHTML = socialProfile.friends.length ? socialProfile.friends.map((friend) => {
		const badges = badgesForActivity({ streak: Number(friend.streakDays) || 0, minutes: Number(friend.minutes) || 0 });
		return `<article class="friend-row"><span class="friend-avatar" style="--avatar-color:${friend.avatarColor || '#728c7d'}">${friend.avatar || '☺'}</span><div class="friend-details"><strong>${escapeHTML(friend.username)}</strong><span>${friend.studying ? 'Marked studying · local preview' : 'Added to your local crew'}</span><div class="user-badges">${renderBadgeChips(badges)}</div></div><label class="friend-studying"><input type="checkbox" data-friend-study="${escapeHTML(friend.username)}" ${friend.studying ? 'checked' : ''}> Studying</label><label class="friend-minutes">WEEKLY MINUTES<input type="number" min="0" max="9999" value="${Number(friend.minutes) || 0}" data-friend-minutes="${escapeHTML(friend.username)}"></label><label class="friend-streak">STREAK DAYS<input type="number" min="0" max="365" value="${Number(friend.streakDays) || 0}" data-friend-streak="${escapeHTML(friend.username)}"></label><button class="icon-button remove-friend" data-remove-friend="${escapeHTML(friend.username)}" aria-label="Remove ${escapeHTML(friend.username)}">×</button></article>`;
	}).join('') : '<p class="empty-state">Your crew is empty. Add someone by username to start a local leaderboard.</p>';
	renderFlightCrew();
	renderLeaderboard();
}

function addFriend(username) {
	const cleanName = username.trim().replace(/^@/, '');
	if (!cleanName || cleanName.toLowerCase() === socialProfile.username.toLowerCase() || socialProfile.friends.some((friend) => friend.username.toLowerCase() === cleanName.toLowerCase())) return false;
	socialProfile.friends.push({ username: cleanName, studying: false, minutes: 0, streakDays: 0, avatar: avatarFaces[(socialProfile.friends.length + 2) % avatarFaces.length], avatarColor: avatarColors[(socialProfile.friends.length + 2) % avatarColors.length] });
	saveSocialProfile();
	renderFriends();
	return true;
}

function renderLeaderboard() {
	const progress = readProgress();
	const today = new Date();
	let weeklySeconds = 0;
	for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
		const date = new Date(today);
		date.setDate(today.getDate() - dayOffset);
		weeklySeconds += progress.daily[dateKey(date)]?.seconds || 0;
	}
	const rankings = [{ username: socialProfile.username || 'Learner', minutes: Math.floor(weeklySeconds / 60), streakDays: progress.streak, answered: progress.totalAnswered, correct: progress.totalCorrect, avatar: socialProfile.avatar, avatarColor: socialProfile.avatarColor, own: true }, ...socialProfile.friends.map((friend) => ({ ...friend, minutes: Number(friend.minutes) || 0 }))].sort((first, second) => second.minutes - first.minutes);
	document.getElementById('leaderboard-list').innerHTML = rankings.map((entry, index) => `<div class="leaderboard-row ${entry.own ? 'leaderboard-own' : ''}"><span class="leader-rank">${String(index + 1).padStart(2, '0')}</span><span class="friend-avatar" style="--avatar-color:${entry.avatarColor || '#728c7d'}">${entry.avatar || '☺'}</span><div class="leader-name"><strong>${escapeHTML(entry.username)}${entry.own ? ' · you' : ''}</strong><div class="user-badges">${renderBadgeChips(badgesForActivity(entry))}</div></div><span>${entry.minutes} min</span></div>`).join('');
}

function renderAvatar() {
	document.getElementById('profile-username').value = socialProfile.username || '';
	document.getElementById('avatar-face').textContent = socialProfile.avatar || '🙂';
	document.getElementById('avatar-preview').style.setProperty('--avatar-color', socialProfile.avatarColor || avatarColors[0]);
	document.getElementById('avatar-accessory').textContent = shopItems.find((item) => item.id === socialProfile.accessory)?.icon || '';
	const progress = readProgress();
	document.getElementById('coin-count').textContent = String(progress.coins);
	document.getElementById('user-badges').innerHTML = renderBadgeChips(badgesForActivity({ streak: progress.streak, answered: progress.totalAnswered, correct: progress.totalCorrect, minutes: Math.floor(progress.totalSeconds / 60) }));
	document.getElementById('avatar-choices').innerHTML = avatarFaces.map((face) => `<button class="avatar-choice ${socialProfile.avatar === face ? 'selected' : ''}" data-avatar="${face}" aria-label="Choose avatar ${face}">${face}</button>`).join('');
	document.getElementById('avatar-colours').innerHTML = avatarColors.map((color) => `<button class="avatar-color-choice ${socialProfile.avatarColor === color ? 'selected' : ''}" data-avatar-color="${color}" style="--swatch:${color}" aria-label="Choose avatar colour"></button>`).join('');
	renderShop();
	renderExamBoards();
}

function renderShop() {
	const coins = readProgress().coins;
	document.getElementById('avatar-shop').innerHTML = shopItems.map((item) => {
		const owned = socialProfile.inventory.includes(item.id);
		const equipped = socialProfile.accessory === item.id;
		return `<article class="shop-item"><span class="shop-item-icon">${item.icon}</span><div><strong>${item.name}</strong><small>${owned ? 'In your wardrobe' : `${item.cost} study coins`}</small></div><button class="button ${equipped ? 'button-dark' : 'button-outline'}" data-shop-item="${item.id}" ${!owned && coins < item.cost ? 'disabled' : ''}>${equipped ? 'Wearing' : owned ? 'Wear' : 'Unlock'}</button></article>`;
	}).join('');
}

function renderExamBoards() {
	const selectedSubjects = getSelectedSubjects();
	document.getElementById('exam-board-list').innerHTML = selectedSubjects.map((subject) => `<label class="board-row"><span>${subject}</span><select data-exam-subject="${subject}"><option value="">Choose board</option>${examBoards.map((board) => `<option ${socialProfile.examBoards[subject] === board ? 'selected' : ''}>${board}</option>`).join('')}</select></label>`).join('');
}

function renderSocialViews() {
	renderFriends();
	renderAvatar();
	renderFlight();
}

function getPortfolio(key) { return safeRead(key, []); }

function portfolioPreview(sourceCanvas) {
	const preview = document.createElement('canvas');
	preview.width = 360;
	preview.height = 216;
	const context = preview.getContext('2d');
	context.fillStyle = '#ffffff';
	context.fillRect(0, 0, preview.width, preview.height);
	context.drawImage(sourceCanvas, 0, 0, preview.width, preview.height);
	return preview.toDataURL('image/jpeg', .62);
}

function savePortfolioItem(key, item) {
	const portfolio = getPortfolio(key);
	portfolio.unshift({ id: crypto.randomUUID(), created: new Date().toISOString(), ...item });
	localStorage.setItem(key, JSON.stringify(portfolio.slice(0, 20)));
}

function renderPortfolio(key, containerId) {
	const portfolio = getPortfolio(key);
	document.getElementById(containerId).innerHTML = portfolio.length ? portfolio.map((item) => `<article class="portfolio-item"><img src="${item.preview}" alt="${escapeHTML(item.title)}"><div><strong>${escapeHTML(item.title)}</strong><span>${formatDate(item.created)}</span><p>${escapeHTML(item.notes || '')}</p></div><button class="icon-button" data-delete-portfolio="${item.id}" data-portfolio-key="${key}" aria-label="Delete ${escapeHTML(item.title)}">×</button></article>`).join('') : '<p class="empty-state">Your portfolio is empty. Save a study to keep it here.</p>';
}

function initializeArtCanvas() {
	const canvas = document.getElementById('digital-canvas');
	const context = canvas.getContext('2d');
	let drawing = false;
	let erasing = false;
	context.fillStyle = '#fffefa';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.lineCap = 'round';
	context.lineJoin = 'round';
	canvas.addEventListener('pointerdown', (event) => {
		drawing = true;
		canvas.setPointerCapture(event.pointerId);
		const rect = canvas.getBoundingClientRect();
		context.beginPath();
		context.moveTo((event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height);
	});
	canvas.addEventListener('pointermove', (event) => {
		if (!drawing) return;
		const rect = canvas.getBoundingClientRect();
		context.strokeStyle = erasing ? '#fffefa' : document.getElementById('art-color').value;
		context.lineWidth = Number(document.getElementById('art-size').value) * canvas.width / rect.width;
		context.lineTo((event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height);
		context.stroke();
	});
	const stopDrawing = () => { drawing = false; };
	canvas.addEventListener('pointerup', stopDrawing);
	canvas.addEventListener('pointercancel', stopDrawing);
	document.getElementById('art-eraser').addEventListener('click', (event) => {
		erasing = !erasing;
		event.currentTarget.classList.toggle('button-dark', erasing);
	});
	document.getElementById('clear-art').addEventListener('click', () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#fffefa';
		context.fillRect(0, 0, canvas.width, canvas.height);
	});
	document.getElementById('save-art').addEventListener('click', () => {
		const title = document.getElementById('art-title').value.trim();
		if (!title) { document.getElementById('art-title').focus(); return; }
		savePortfolioItem('revise-rise-art-portfolio', { title, preview: portfolioPreview(canvas), notes: 'Digital study' });
		document.getElementById('art-title').value = '';
		renderPortfolio('revise-rise-art-portfolio', 'art-portfolio');
	});
	document.getElementById('new-art-prompt').addEventListener('click', () => {
		const prompts = ['Draw a familiar object using only curved lines.', 'Make a study using one warm and one cool colour.', 'Sketch the same object from two different viewpoints.', 'Use three values to show a bright light source.'];
		document.querySelector('.creative-brief h2').textContent = prompts[Math.floor(Math.random() * prompts.length)];
	});
	document.getElementById('art-portfolio').addEventListener('click', (event) => deletePortfolioEntry(event, 'revise-rise-art-portfolio', 'art-portfolio'));
	renderPortfolio('revise-rise-art-portfolio', 'art-portfolio');
}

let selectedPhoto = null;
let dramaStream = null;
let dramaRecorder = null;
let dramaChunks = [];
let dramaBlob = null;
let dramaPlaybackUrl = null;
function drawPhoto() {
	if (!selectedPhoto) return;
	const canvas = document.getElementById('photo-canvas');
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.filter = `brightness(${document.getElementById('photo-brightness').value}%) contrast(${document.getElementById('photo-contrast').value}%) saturate(${document.getElementById('photo-saturation').value}%)`;
	const scale = Math.min(canvas.width / selectedPhoto.width, canvas.height / selectedPhoto.height);
	const width = selectedPhoto.width * scale;
	const height = selectedPhoto.height * scale;
	context.drawImage(selectedPhoto, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
	context.filter = 'none';
}

function initializePhotoStudio() {
	document.getElementById('photo-upload').addEventListener('change', (event) => {
		const file = event.target.files?.[0];
		if (!file || !file.type.startsWith('image/')) return;
		const url = URL.createObjectURL(file);
		selectedPhoto = new Image();
		selectedPhoto.onload = () => {
			drawPhoto();
			URL.revokeObjectURL(url);
			document.getElementById('photo-empty').hidden = true;
			document.getElementById('photo-file-name').textContent = file.name;
			document.getElementById('save-photo').disabled = false;
		};
		selectedPhoto.src = url;
	});
	['photo-brightness', 'photo-contrast', 'photo-saturation'].forEach((id) => document.getElementById(id).addEventListener('input', drawPhoto));
	document.getElementById('reset-photo').addEventListener('click', () => {
		['photo-brightness', 'photo-contrast', 'photo-saturation'].forEach((id) => { document.getElementById(id).value = 100; });
		drawPhoto();
	});
	document.getElementById('save-photo').addEventListener('click', () => {
		const title = document.getElementById('photo-title').value.trim();
		if (!selectedPhoto || !title) { document.getElementById('photo-title').focus(); return; }
		savePortfolioItem('revise-rise-photo-portfolio', { title, preview: portfolioPreview(document.getElementById('photo-canvas')), notes: document.getElementById('photo-analysis').value.trim() });
		document.getElementById('photo-title').value = '';
		document.getElementById('photo-analysis').value = '';
		renderPortfolio('revise-rise-photo-portfolio', 'photo-portfolio');
	});
	document.getElementById('photo-portfolio').addEventListener('click', (event) => deletePortfolioEntry(event, 'revise-rise-photo-portfolio', 'photo-portfolio'));
	renderPortfolio('revise-rise-photo-portfolio', 'photo-portfolio');
}

const sequencerPitches = [
	{ name: 'C5', midi: 72 }, { name: 'A4', midi: 69 }, { name: 'G4', midi: 67 }, { name: 'E4', midi: 64 },
	{ name: 'D4', midi: 62 }, { name: 'C4', midi: 60 }, { name: 'A3', midi: 57 }, { name: 'G3', midi: 55 }
];
function renderSequencer() {
	const grid = document.getElementById('sequencer-grid');
	grid.innerHTML = sequencerPitches.map((pitch, row) => `<div class="sequencer-row"><span>${pitch.name}</span>${musicPattern[row].map((active, step) => `<button class="sequence-step ${active ? 'active' : ''} ${step % 4 === 0 ? 'beat-start' : ''}" data-sequence-row="${row}" data-sequence-step="${step}" aria-label="${pitch.name}, step ${step + 1}" aria-pressed="${active}"></button>`).join('')}</div>`).join('');
}

function toggleSequenceStep(button) {
	const row = Number(button.dataset.sequenceRow);
	const step = Number(button.dataset.sequenceStep);
	musicPattern[row][step] = !musicPattern[row][step];
	button.classList.toggle('active', musicPattern[row][step]);
	button.setAttribute('aria-pressed', String(musicPattern[row][step]));
}

async function playMusicPattern() {
	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	if (!AudioContextClass) { document.getElementById('music-play-status').textContent = 'Web Audio is not available in this browser.'; return; }
	musicContext ||= new AudioContextClass();
	await musicContext.resume();
	if (musicInterval) return;
	musicStep = 0;
	const tempo = Number(document.getElementById('music-tempo').value);
	const secondsPerStep = 60 / tempo / 4;
	const instrument = document.getElementById('music-instrument').value;
	const volume = Number(document.getElementById('music-volume').value) / 100 * .12;
	document.getElementById('play-music').disabled = true;
	document.getElementById('stop-music').disabled = false;
	document.getElementById('music-play-status').textContent = 'Playing locally in your browser.';
	const playStep = () => {
		document.querySelectorAll('.sequence-step.playing').forEach((step) => step.classList.remove('playing'));
		document.querySelectorAll(`[data-sequence-step="${musicStep}"]`).forEach((button) => button.classList.add('playing'));
		musicPattern.forEach((row, rowIndex) => {
			if (!row[musicStep]) return;
			const oscillator = musicContext.createOscillator();
			const gain = musicContext.createGain();
			const now = musicContext.currentTime;
			oscillator.type = instrument;
			oscillator.frequency.value = 440 * Math.pow(2, (sequencerPitches[rowIndex].midi - 69) / 12);
			gain.gain.setValueAtTime(.001, now);
			gain.gain.exponentialRampToValueAtTime(Math.max(.002, volume), now + .015);
			gain.gain.exponentialRampToValueAtTime(.001, now + secondsPerStep * .8);
			oscillator.connect(gain).connect(musicContext.destination);
			oscillator.start(now);
			oscillator.stop(now + secondsPerStep * .85);
		});
		musicStep = (musicStep + 1) % 16;
	};
	playStep();
	musicInterval = setInterval(playStep, secondsPerStep * 1000);
}

function stopMusicPattern() {
	clearInterval(musicInterval);
	musicInterval = null;
	document.querySelectorAll('.sequence-step.playing').forEach((step) => step.classList.remove('playing'));
	document.getElementById('play-music').disabled = false;
	document.getElementById('stop-music').disabled = true;
	document.getElementById('music-play-status').textContent = 'Pattern stopped.';
}

function renderMusicPortfolio() {
	const items = getPortfolio('revise-rise-music-portfolio');
	document.getElementById('music-portfolio').innerHTML = items.length ? items.map((item) => `<article class="portfolio-item music-portfolio-item"><div><strong>${escapeHTML(item.title)}</strong><span>${item.instrument} · ${item.tempo} BPM · ${formatDate(item.created)}</span><p>${escapeHTML(item.lyrics || 'No lyrics saved')}</p></div><button class="button button-outline" data-load-song="${item.id}">Load pattern</button><button class="icon-button" data-delete-music="${item.id}" aria-label="Delete ${escapeHTML(item.title)}">×</button></article>`).join('') : '<p class="empty-state">No songs saved yet. Try a rhythm and save your idea.</p>';
}

function initializeMusicStudio() {
	renderSequencer();
	renderMusicPortfolio();
	document.getElementById('sequencer-grid').addEventListener('click', (event) => {
		const button = event.target.closest('[data-sequence-row]');
		if (button) toggleSequenceStep(button);
	});
	document.getElementById('music-tempo').addEventListener('input', (event) => { document.getElementById('music-tempo-label').textContent = `${event.target.value} BPM`; });
	document.getElementById('play-music').addEventListener('click', playMusicPattern);
	document.getElementById('stop-music').addEventListener('click', stopMusicPattern);
	document.getElementById('clear-sequencer').addEventListener('click', () => { musicPattern = Array.from({ length: sequencerPitches.length }, () => Array(16).fill(false)); renderSequencer(); });
	document.getElementById('save-song').addEventListener('click', () => {
		const title = document.getElementById('song-title').value.trim();
		if (!title) { document.getElementById('song-title').focus(); return; }
		const portfolio = getPortfolio('revise-rise-music-portfolio');
		portfolio.unshift({ id: crypto.randomUUID(), title, lyrics: document.getElementById('song-lyrics').value, instrument: document.getElementById('music-instrument').selectedOptions[0].textContent, tempo: Number(document.getElementById('music-tempo').value), pattern: musicPattern, created: new Date().toISOString() });
		localStorage.setItem('revise-rise-music-portfolio', JSON.stringify(portfolio.slice(0, 20)));
		document.getElementById('song-title').value = '';
		document.getElementById('song-lyrics').value = '';
		renderMusicPortfolio();
	});
	document.getElementById('music-portfolio').addEventListener('click', (event) => {
		const deleteId = event.target.closest('[data-delete-music]')?.dataset.deleteMusic;
		const loadId = event.target.closest('[data-load-song]')?.dataset.loadSong;
		const portfolio = getPortfolio('revise-rise-music-portfolio');
		if (deleteId) localStorage.setItem('revise-rise-music-portfolio', JSON.stringify(portfolio.filter((item) => item.id !== deleteId)));
		if (loadId) {
			const song = portfolio.find((item) => item.id === loadId);
			if (song) { musicPattern = song.pattern; document.getElementById('song-title').value = song.title; document.getElementById('song-lyrics').value = song.lyrics; document.getElementById('music-tempo').value = song.tempo; document.getElementById('music-tempo-label').textContent = `${song.tempo} BPM`; renderSequencer(); }
		}
		if (deleteId) renderMusicPortfolio();
	});
}

function stopVoiceRange() {
	if (voiceFrame) cancelAnimationFrame(voiceFrame);
	voiceFrame = null;
	voiceStream?.getTracks().forEach((track) => track.stop());
	voiceStream = null;
	voiceContext?.close();
	voiceContext = null;
	document.getElementById('start-voice-range').disabled = false;
	document.getElementById('stop-voice-range').disabled = true;
	document.getElementById('voice-status').textContent = 'Microphone off. Range estimate stays on this device.';
	if (voiceMinHz < Infinity && voiceMaxHz > 0) document.getElementById('voice-range-result').textContent = `Estimated comfortable sample: ${pitchName(voiceMinHz)} to ${pitchName(voiceMaxHz)}. This is a rough practice guide, not a voice classification.`;
}

function pitchName(frequency) {
	const noteNumber = Math.round(69 + 12 * Math.log2(frequency / 440));
	const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
	return `${names[(noteNumber % 12 + 12) % 12]}${Math.floor(noteNumber / 12) - 1}`;
}

function estimatePitch(samples, sampleRate) {
	let energy = 0;
	for (let index = 0; index < samples.length; index += 1) energy += samples[index] * samples[index];
	if (Math.sqrt(energy / samples.length) < .012) return null;
	const minLag = Math.floor(sampleRate / 850);
	const maxLag = Math.min(Math.floor(sampleRate / 75), samples.length - 1);
	let bestLag = 0;
	let bestCorrelation = 0;
	for (let lag = minLag; lag <= maxLag; lag += 1) {
		let correlation = 0;
		for (let index = 0; index < samples.length - lag; index += 2) correlation += samples[index] * samples[index + lag];
		if (correlation > bestCorrelation) { bestCorrelation = correlation; bestLag = lag; }
	}
	return bestLag && bestCorrelation > .35 ? sampleRate / bestLag : null;
}

async function startVoiceRange() {
	if (!navigator.mediaDevices?.getUserMedia) { document.getElementById('voice-status').textContent = 'Microphone access is unavailable here. Try a secure HTTPS site or localhost.'; return; }
	try {
		voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		voiceContext = new AudioContextClass();
		const source = voiceContext.createMediaStreamSource(voiceStream);
		const analyser = voiceContext.createAnalyser();
		analyser.fftSize = 2048;
		source.connect(analyser);
		const samples = new Float32Array(analyser.fftSize);
		voiceMinHz = Infinity;
		voiceMaxHz = 0;
		let frames = 0;
		document.getElementById('start-voice-range').disabled = true;
		document.getElementById('stop-voice-range').disabled = false;
		document.getElementById('voice-status').textContent = 'Sing or hum a comfortable note; stop if your voice feels strained.';
		const sample = () => {
			frames += 1;
			if (frames % 6 === 0) {
				analyser.getFloatTimeDomainData(samples);
				const hz = estimatePitch(samples, voiceContext.sampleRate);
				if (hz && hz >= 75 && hz <= 850) {
					voiceMinHz = Math.min(voiceMinHz, hz);
					voiceMaxHz = Math.max(voiceMaxHz, hz);
					document.getElementById('voice-pitch').textContent = pitchName(hz);
					document.getElementById('voice-frequency').textContent = `${Math.round(hz)} Hz · sample range ${pitchName(voiceMinHz)}–${pitchName(voiceMaxHz)}`;
					document.getElementById('voice-range-result').textContent = `Current comfortable samples: ${pitchName(voiceMinHz)} to ${pitchName(voiceMaxHz)}. Extend gently; never force a note.`;
				}
			}
			voiceFrame = requestAnimationFrame(sample);
		};
		sample();
	} catch {
		document.getElementById('voice-status').textContent = 'Microphone permission was not granted. You can still use the instrument sequencer and lyric portfolio.';
	}
}

function updateDramaTarget() {
	const strengths = [...document.querySelectorAll('[data-drama-strength]:checked')].map((input) => input.dataset.dramaStrength);
	const growth = document.getElementById('drama-growth').value;
	const wentWell = strengths.length ? strengths.join(', ') : 'Choose a performance strength you noticed';
	document.getElementById('drama-target').textContent = `Went well: ${wentWell}. Next-session target: practise ${growth} in one short section, then review the recording.`;
}

function openDramaDatabase() {
	return new Promise((resolve, reject) => {
		if (!indexedDB) { reject(new Error('Local video storage is unavailable.')); return; }
		const request = indexedDB.open('revise-rise-drama', 1);
		request.onupgradeneeded = () => request.result.createObjectStore('clips', { keyPath: 'id' });
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function storeDramaClip(id, blob) {
	const database = await openDramaDatabase();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction('clips', 'readwrite');
		transaction.objectStore('clips').put({ id, blob });
		transaction.oncomplete = () => { database.close(); resolve(); };
		transaction.onerror = () => { database.close(); reject(transaction.error); };
	});
}

async function loadDramaClip(id) {
	const database = await openDramaDatabase();
	return new Promise((resolve, reject) => {
		const request = database.transaction('clips').objectStore('clips').get(id);
		request.onsuccess = () => { database.close(); resolve(request.result?.blob || null); };
		request.onerror = () => { database.close(); reject(request.error); };
});
}

async function removeDramaClip(id) {
	try {
		const database = await openDramaDatabase();
		const transaction = database.transaction('clips', 'readwrite');
		transaction.objectStore('clips').delete(id);
		transaction.oncomplete = () => database.close();
	} catch {}
}

async function renderDramaPortfolio() {
	const items = getPortfolio('revise-rise-drama-portfolio');
	const portfolio = document.getElementById('drama-portfolio');
	portfolio.innerHTML = items.length ? items.map((item) => `<article class="portfolio-item drama-portfolio-item"><div><strong>${escapeHTML(item.title)}</strong><span>${formatDate(item.created)} · ${item.hasClip ? 'Local rehearsal clip' : 'Reflection only'}</span><p>Went well: ${escapeHTML(item.strengths || 'No strengths selected')}. Next target: ${escapeHTML(item.target)}</p><p>${escapeHTML(item.notes || '')}</p><video controls playsinline data-drama-clip="${item.id}" hidden></video></div><button class="icon-button" data-delete-drama="${item.id}" aria-label="Delete ${escapeHTML(item.title)}">×</button></article>`).join('') : '<p class="empty-state">No rehearsal reflections saved yet.</p>';
	for (const item of items.filter((entry) => entry.hasClip)) {
		try {
			const blob = await loadDramaClip(item.id);
			const player = portfolio.querySelector(`[data-drama-clip="${item.id}"]`);
			if (blob && player) { player.src = URL.createObjectURL(blob); player.hidden = false; }
		} catch {}
	}
}

function initializeDramaStudio() {
	document.getElementById('start-drama-recording').addEventListener('click', async () => {
		if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { document.getElementById('drama-record-status').textContent = 'Recording is unavailable in this browser. Try a secure HTTPS site or localhost.'; return; }
		try {
			dramaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			const preview = document.getElementById('drama-preview');
			preview.srcObject = dramaStream;
			await preview.play();
			dramaChunks = [];
			dramaRecorder = new MediaRecorder(dramaStream);
			dramaRecorder.ondataavailable = (event) => { if (event.data.size) dramaChunks.push(event.data); };
			dramaRecorder.onstop = () => {
				dramaBlob = new Blob(dramaChunks, { type: dramaRecorder.mimeType || 'video/webm' });
				const playback = document.getElementById('drama-playback');
				playback.src = URL.createObjectURL(dramaBlob);
				playback.hidden = false;
				document.getElementById('save-drama-clip').disabled = false;
				document.getElementById('drama-record-status').textContent = 'Recording stopped. Review it, then choose whether to save it locally.';
			};
			dramaRecorder.start(500);
			document.getElementById('start-drama-recording').disabled = true;
			document.getElementById('stop-drama-recording').disabled = false;
			document.getElementById('drama-record-status').textContent = 'Recording on this device…';
		} catch {
			document.getElementById('drama-record-status').textContent = 'Camera or microphone permission was not granted. You can still complete the self-review.';
		}
	});
	document.getElementById('stop-drama-recording').addEventListener('click', () => {
		if (dramaRecorder?.state === 'recording') dramaRecorder.stop();
		dramaStream?.getTracks().forEach((track) => track.stop());
		dramaStream = null;
		document.getElementById('drama-preview').srcObject = null;
		document.getElementById('start-drama-recording').disabled = false;
		document.getElementById('stop-drama-recording').disabled = true;
	});
	document.getElementById('save-drama-clip').addEventListener('click', async () => {
		const title = document.getElementById('drama-title').value.trim();
		if (!title) { document.getElementById('drama-title').focus(); return; }
		const id = crypto.randomUUID();
		const strengths = [...document.querySelectorAll('[data-drama-strength]:checked')].map((input) => input.dataset.dramaStrength);
		const entry = { id, title, created: new Date().toISOString(), hasClip: Boolean(dramaBlob), strengths: strengths.join(', '), target: document.getElementById('drama-growth').value, notes: document.getElementById('drama-notes').value.trim() };
		if (dramaBlob) {
			try { await storeDramaClip(id, dramaBlob); }
			catch { entry.hasClip = false; document.getElementById('drama-record-status').textContent = 'The browser could not store this video locally. Save a written reflection instead.'; }
		}
		const entries = getPortfolio('revise-rise-drama-portfolio');
		entries.unshift(entry);
		localStorage.setItem('revise-rise-drama-portfolio', JSON.stringify(entries.slice(0, 20)));
		dramaBlob = null;
		document.getElementById('save-drama-clip').disabled = true;
		await renderDramaPortfolio();
	});
	document.querySelectorAll('[data-drama-strength], #drama-growth').forEach((element) => element.addEventListener('change', updateDramaTarget));
	document.getElementById('drama-portfolio').addEventListener('click', async (event) => {
		const id = event.target.closest('[data-delete-drama]')?.dataset.deleteDrama;
		if (!id) return;
		await removeDramaClip(id);
		localStorage.setItem('revise-rise-drama-portfolio', JSON.stringify(getPortfolio('revise-rise-drama-portfolio').filter((item) => item.id !== id)));
		await renderDramaPortfolio();
	});
	updateDramaTarget();
	renderDramaPortfolio();
}

function initializeVoiceRange() {
	document.getElementById('start-voice-range').addEventListener('click', startVoiceRange);
	document.getElementById('stop-voice-range').addEventListener('click', stopVoiceRange);
}

function deletePortfolioEntry(event, key, containerId) {
	const id = event.target.closest('[data-delete-portfolio]')?.dataset.deletePortfolio;
	if (!id) return;
	localStorage.setItem(key, JSON.stringify(getPortfolio(key).filter((item) => item.id !== id)));
	renderPortfolio(key, containerId);
}

const musicNotes = [{ name: 'C5', midi: 72 }, { name: 'A4', midi: 69 }, { name: 'G4', midi: 67 }, { name: 'E4', midi: 64 }, { name: 'D4', midi: 62 }, { name: 'C4', midi: 60 }, { name: 'A3', midi: 57 }, { name: 'G3', midi: 55 }];
let musicPattern = Array.from({ length: musicNotes.length }, () => Array(16).fill(false));
let musicContext = null;
let musicTimer = null;
let musicStepIndex = 0;
let voiceContext = null;
let voiceStream = null;
let voiceAnimation = null;
let voiceMinHz = Infinity;
let voiceMaxHz = 0;

function renderMusicSequencer() {
	document.getElementById('sequencer-grid').innerHTML = musicNotes.map((note, row) => `<div class="sequencer-row"><span>${note.name}</span>${musicPattern[row].map((active, step) => `<button class="sequence-step ${active ? 'active' : ''} ${step % 4 === 0 ? 'beat-start' : ''}" data-sequence-row="${row}" data-sequence-step="${step}" aria-label="${note.name}, step ${step + 1}" aria-pressed="${active}"></button>`).join('')}</div>`).join('');
}

function stopMusicSequencer() {
	clearInterval(musicTimer);
	musicTimer = null;
	document.querySelectorAll('.sequence-step.playing').forEach((step) => step.classList.remove('playing'));
	document.getElementById('play-music').disabled = false;
	document.getElementById('stop-music').disabled = true;
	document.getElementById('music-play-status').textContent = 'Pattern stopped.';
}

async function playMusicSequencer() {
	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	if (!AudioContextClass) { document.getElementById('music-play-status').textContent = 'Audio playback is unavailable in this browser.'; return; }
	musicContext ||= new AudioContextClass();
	await musicContext.resume();
	if (musicTimer) return;
	musicStepIndex = 0;
	const interval = 60000 / Number(document.getElementById('music-tempo').value) / 4;
	const waveform = document.getElementById('music-instrument').value;
	const volume = Number(document.getElementById('music-volume').value) / 100 * .12;
	document.getElementById('play-music').disabled = true;
	document.getElementById('stop-music').disabled = false;
	document.getElementById('music-play-status').textContent = 'Playing locally in your browser.';
	const playStep = () => {
		document.querySelectorAll('.sequence-step.playing').forEach((step) => step.classList.remove('playing'));
		document.querySelectorAll(`[data-sequence-step="${musicStepIndex}"]`).forEach((button) => button.classList.add('playing'));
		musicPattern.forEach((row, rowIndex) => {
			if (!row[musicStepIndex]) return;
			const oscillator = musicContext.createOscillator();
			const gain = musicContext.createGain();
			const now = musicContext.currentTime;
			oscillator.type = waveform;
			oscillator.frequency.value = 440 * Math.pow(2, (musicNotes[rowIndex].midi - 69) / 12);
			gain.gain.setValueAtTime(.001, now);
			gain.gain.exponentialRampToValueAtTime(Math.max(.002, volume), now + .015);
			gain.gain.exponentialRampToValueAtTime(.001, now + interval / 1000 * .8);
			oscillator.connect(gain).connect(musicContext.destination);
			oscillator.start(now);
			oscillator.stop(now + interval / 1000 * .85);
		});
		musicStepIndex = (musicStepIndex + 1) % 16;
	};
	playStep();
	musicTimer = setInterval(playStep, interval);
}

function renderMusicPortfolio() {
	const portfolio = getPortfolio('revise-rise-music-portfolio');
	document.getElementById('music-portfolio').innerHTML = portfolio.length ? portfolio.map((song) => `<article class="portfolio-item music-portfolio-item"><div><strong>${escapeHTML(song.title)}</strong><span>${escapeHTML(song.instrument)} · ${song.tempo} BPM · ${formatDate(song.created)}</span><p>${escapeHTML(song.lyrics || 'No lyrics saved')}</p></div><button class="button button-outline" data-load-song="${song.id}">Load pattern</button><button class="icon-button" data-delete-music="${song.id}" aria-label="Delete ${escapeHTML(song.title)}">×</button></article>`).join('') : '<p class="empty-state">No songs saved yet. Try a rhythm and save your idea.</p>';
}

function initializeMusicStudio() {
	renderMusicSequencer();
	renderMusicPortfolio();
	document.getElementById('sequencer-grid').addEventListener('click', (event) => {
		const button = event.target.closest('[data-sequence-row]');
		if (!button) return;
		const row = Number(button.dataset.sequenceRow);
		const step = Number(button.dataset.sequenceStep);
		musicPattern[row][step] = !musicPattern[row][step];
		button.classList.toggle('active', musicPattern[row][step]);
		button.setAttribute('aria-pressed', String(musicPattern[row][step]));
	});
	document.getElementById('music-tempo').addEventListener('input', (event) => { document.getElementById('music-tempo-label').textContent = `${event.target.value} BPM`; });
	document.getElementById('play-music').addEventListener('click', playMusicSequencer);
	document.getElementById('stop-music').addEventListener('click', stopMusicSequencer);
	document.getElementById('clear-sequencer').addEventListener('click', () => { musicPattern = Array.from({ length: musicNotes.length }, () => Array(16).fill(false)); renderMusicSequencer(); });
	document.getElementById('save-song').addEventListener('click', () => {
		const title = document.getElementById('song-title').value.trim();
		if (!title) { document.getElementById('song-title').focus(); return; }
		const portfolio = getPortfolio('revise-rise-music-portfolio');
		portfolio.unshift({ id: crypto.randomUUID(), title, lyrics: document.getElementById('song-lyrics').value, instrument: document.getElementById('music-instrument').selectedOptions[0].textContent, tempo: Number(document.getElementById('music-tempo').value), pattern: musicPattern, created: new Date().toISOString() });
		localStorage.setItem('revise-rise-music-portfolio', JSON.stringify(portfolio.slice(0, 20)));
		document.getElementById('song-title').value = '';
		document.getElementById('song-lyrics').value = '';
		renderMusicPortfolio();
	});
	document.getElementById('music-portfolio').addEventListener('click', (event) => {
		const deleteId = event.target.closest('[data-delete-music]')?.dataset.deleteMusic;
		const loadId = event.target.closest('[data-load-song]')?.dataset.loadSong;
		const portfolio = getPortfolio('revise-rise-music-portfolio');
		if (deleteId) localStorage.setItem('revise-rise-music-portfolio', JSON.stringify(portfolio.filter((song) => song.id !== deleteId)));
		if (loadId) {
			const song = portfolio.find((item) => item.id === loadId);
			if (song) {
				musicPattern = song.pattern;
				document.getElementById('song-title').value = song.title;
				document.getElementById('song-lyrics').value = song.lyrics;
				document.getElementById('music-tempo').value = song.tempo;
				document.getElementById('music-tempo-label').textContent = `${song.tempo} BPM`;
				renderMusicSequencer();
			}
		}
		if (deleteId) renderMusicPortfolio();
	});
}

function pitchName(frequency) {
	const noteNumber = Math.round(69 + 12 * Math.log2(frequency / 440));
	const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
	return `${names[(noteNumber % 12 + 12) % 12]}${Math.floor(noteNumber / 12) - 1}`;
}

function estimatePitch(samples, sampleRate) {
	let energy = 0;
	for (let index = 0; index < samples.length; index += 1) energy += samples[index] * samples[index];
	if (Math.sqrt(energy / samples.length) < .012) return null;
	const minLag = Math.floor(sampleRate / 850);
	const maxLag = Math.min(Math.floor(sampleRate / 75), samples.length - 1);
	let bestLag = 0;
	let bestCorrelation = 0;
	for (let lag = minLag; lag <= maxLag; lag += 1) {
		let correlation = 0;
		for (let index = 0; index < samples.length - lag; index += 2) correlation += samples[index] * samples[index + lag];
		if (correlation > bestCorrelation) { bestCorrelation = correlation; bestLag = lag; }
	}
	return bestLag && bestCorrelation > .35 ? sampleRate / bestLag : null;
}

function stopVoiceRange() {
	if (voiceAnimation) cancelAnimationFrame(voiceAnimation);
	voiceAnimation = null;
	voiceStream?.getTracks().forEach((track) => track.stop());
	voiceStream = null;
	voiceContext?.close();
	voiceContext = null;
	document.getElementById('start-voice-range').disabled = false;
	document.getElementById('stop-voice-range').disabled = true;
	document.getElementById('voice-status').textContent = 'Microphone off. Samples are not uploaded.';
	if (voiceMinHz < Infinity && voiceMaxHz > 0) document.getElementById('voice-range-result').textContent = `${classifyVoiceRange(voiceMinHz, voiceMaxHz)} Sampled notes: ${pitchName(voiceMinHz)} to ${pitchName(voiceMaxHz)}.`;
}

async function startVoiceRange() {
	if (!navigator.mediaDevices?.getUserMedia) { document.getElementById('voice-status').textContent = 'Microphone access requires a secure HTTPS site or localhost.'; return; }
	try {
		voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		voiceContext = new AudioContextClass();
		const source = voiceContext.createMediaStreamSource(voiceStream);
		const analyser = voiceContext.createAnalyser();
		analyser.fftSize = 2048;
		source.connect(analyser);
		const samples = new Float32Array(analyser.fftSize);
		voiceMinHz = Infinity;
		voiceMaxHz = 0;
		let frame = 0;
		document.getElementById('start-voice-range').disabled = true;
		document.getElementById('stop-voice-range').disabled = false;
		document.getElementById('voice-status').textContent = 'Sing or hum gently in a comfortable range. Stop if your voice feels strained.';
		const sample = () => {
			frame += 1;
			if (frame % 6 === 0) {
				analyser.getFloatTimeDomainData(samples);
				const hz = estimatePitch(samples, voiceContext.sampleRate);
				if (hz && hz >= 75 && hz <= 850) {
					voiceMinHz = Math.min(voiceMinHz, hz);
					voiceMaxHz = Math.max(voiceMaxHz, hz);
					document.getElementById('voice-pitch').textContent = pitchName(hz);
					document.getElementById('voice-frequency').textContent = `${Math.round(hz)} Hz · sampled ${pitchName(voiceMinHz)}–${pitchName(voiceMaxHz)}`;
					document.getElementById('voice-range-result').textContent = `Comfortable samples so far: ${pitchName(voiceMinHz)} to ${pitchName(voiceMaxHz)}. Extend gently; never force a note.`;
				}
			}
			voiceAnimation = requestAnimationFrame(sample);
		};
		sample();
	} catch {
		document.getElementById('voice-status').textContent = 'Microphone permission was not granted. Sequencer and lyrics tools remain available.';
	}
}

function updateDramaTarget() {
	const strengths = [...document.querySelectorAll('[data-drama-strength]:checked')].map((input) => input.dataset.dramaStrength);
	const growth = document.getElementById('drama-growth').value;
	const wentWell = strengths.length ? strengths.join(', ') : 'Choose a performance strength you noticed';
	document.getElementById('drama-target').textContent = `Went well: ${wentWell}. Next-session target: practise ${growth} in one short section, then review the recording.`;
}

function openDramaDatabase() {
	return new Promise((resolve, reject) => {
		if (!window.indexedDB) { reject(new Error('Local video storage is unavailable.')); return; }
		const request = indexedDB.open('revise-rise-drama', 1);
		request.onupgradeneeded = () => request.result.createObjectStore('clips', { keyPath: 'id' });
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function saveDramaBlob(id, blob) {
	return openDramaDatabase().then((database) => new Promise((resolve, reject) => {
		const transaction = database.transaction('clips', 'readwrite');
		transaction.objectStore('clips').put({ id, blob });
		transaction.oncomplete = () => { database.close(); resolve(); };
		transaction.onerror = () => { database.close(); reject(transaction.error); };
	}));
}

function getDramaBlob(id) {
	return openDramaDatabase().then((database) => new Promise((resolve, reject) => {
		const request = database.transaction('clips').objectStore('clips').get(id);
		request.onsuccess = () => { database.close(); resolve(request.result?.blob || null); };
		request.onerror = () => { database.close(); reject(request.error); };
	}));
}

async function renderDramaPortfolio() {
	const entries = getPortfolio('revise-rise-drama-portfolio');
	const portfolio = document.getElementById('drama-portfolio');
	portfolio.innerHTML = entries.length ? entries.map((entry) => `<article class="portfolio-item drama-portfolio-item"><div><strong>${escapeHTML(entry.title)}</strong><span>${formatDate(entry.created)} · ${entry.hasClip ? 'Private clip stored in this browser' : 'Reflection only'}</span><p>Went well: ${escapeHTML(entry.strengths || 'No strength selected')}. Next target: ${escapeHTML(entry.target)}</p><p>${escapeHTML(entry.notes || '')}</p><video controls playsinline data-drama-clip="${entry.id}" hidden></video></div><button class="icon-button" data-delete-drama="${entry.id}" aria-label="Delete ${escapeHTML(entry.title)}">×</button></article>`).join('') : '<p class="empty-state">No rehearsal reflections saved yet.</p>';
	for (const entry of entries.filter((item) => item.hasClip)) {
		try {
			const blob = await getDramaBlob(entry.id);
			const player = portfolio.querySelector(`[data-drama-clip="${entry.id}"]`);
			if (blob && player) { player.src = URL.createObjectURL(blob); player.hidden = false; }
		} catch {}
	}
}

function initializeDramaStudio() {
	document.getElementById('start-drama-recording').addEventListener('click', async () => {
		if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { document.getElementById('drama-record-status').textContent = 'Recording needs a supported browser and a secure HTTPS site or localhost.'; return; }
		try {
			dramaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			const preview = document.getElementById('drama-preview');
			preview.srcObject = dramaStream;
			await preview.play();
			dramaChunks = [];
			dramaRecorder = new MediaRecorder(dramaStream);
			dramaRecorder.ondataavailable = (event) => { if (event.data.size) dramaChunks.push(event.data); };
			dramaRecorder.onstop = () => {
				dramaBlob = new Blob(dramaChunks, { type: dramaRecorder.mimeType || 'video/webm' });
				const playback = document.getElementById('drama-playback');
				if (dramaPlaybackUrl) URL.revokeObjectURL(dramaPlaybackUrl);
				dramaPlaybackUrl = URL.createObjectURL(dramaBlob);
				playback.src = dramaPlaybackUrl;
				playback.hidden = false;
				document.getElementById('save-drama-clip').disabled = false;
				document.getElementById('drama-record-status').textContent = 'Recording stopped. Review it, then choose whether to save locally.';
			};
			dramaRecorder.start(500);
			document.getElementById('start-drama-recording').disabled = true;
			document.getElementById('stop-drama-recording').disabled = false;
			document.getElementById('drama-record-status').textContent = 'Recording on this device…';
		} catch {
			document.getElementById('drama-record-status').textContent = 'Camera or microphone permission was not granted. You can still complete the self-review.';
		}
	});
	document.getElementById('stop-drama-recording').addEventListener('click', () => {
		if (dramaRecorder?.state === 'recording') dramaRecorder.stop();
		dramaStream?.getTracks().forEach((track) => track.stop());
		dramaStream = null;
		document.getElementById('drama-preview').srcObject = null;
		document.getElementById('start-drama-recording').disabled = false;
		document.getElementById('stop-drama-recording').disabled = true;
	});
	document.getElementById('save-drama-clip').addEventListener('click', async () => {
		const title = document.getElementById('drama-title').value.trim();
		if (!title) { document.getElementById('drama-title').focus(); return; }
		const id = crypto.randomUUID();
		const strengths = [...document.querySelectorAll('[data-drama-strength]:checked')].map((input) => input.dataset.dramaStrength);
		const entry = { id, title, created: new Date().toISOString(), hasClip: Boolean(dramaBlob), strengths: strengths.join(', '), target: document.getElementById('drama-growth').value, notes: document.getElementById('drama-notes').value.trim() };
		if (dramaBlob) {
			try { await saveDramaBlob(id, dramaBlob); }
			catch { entry.hasClip = false; document.getElementById('drama-record-status').textContent = 'The browser could not store this video locally. Save a written reflection instead.'; }
		}
		const entries = getPortfolio('revise-rise-drama-portfolio');
		entries.unshift(entry);
		localStorage.setItem('revise-rise-drama-portfolio', JSON.stringify(entries.slice(0, 20)));
		dramaBlob = null;
		document.getElementById('save-drama-clip').disabled = true;
		await renderDramaPortfolio();
	});
	document.querySelectorAll('[data-drama-strength], #drama-growth').forEach((element) => element.addEventListener('change', updateDramaTarget));
	document.getElementById('drama-portfolio').addEventListener('click', async (event) => {
		const id = event.target.closest('[data-delete-drama]')?.dataset.deleteDrama;
		if (!id) return;
		try {
			const database = await openDramaDatabase();
			const transaction = database.transaction('clips', 'readwrite');
			transaction.objectStore('clips').delete(id);
			transaction.oncomplete = () => database.close();
		} catch {}
		localStorage.setItem('revise-rise-drama-portfolio', JSON.stringify(getPortfolio('revise-rise-drama-portfolio').filter((item) => item.id !== id)));
		await renderDramaPortfolio();
	});
	updateDramaTarget();
	renderDramaPortfolio();
}

function initializeVoiceRange() {
	document.getElementById('start-voice-range').addEventListener('click', startVoiceRange);
	document.getElementById('stop-voice-range').addEventListener('click', stopVoiceRange);
}

function goToView(view, subject = null) {
	if (!viewNames[view]) return;
	if (currentView === 'musicstudio' && view !== 'musicstudio') stopMusicSequencer();
	if (currentView === 'dramastudio' && view !== 'dramastudio' && dramaRecorder?.state === 'recording') document.getElementById('stop-drama-recording').click();
	if (currentView === 'musicstudio' && view !== 'musicstudio' && voiceStream) stopVoiceRange();
	currentView = view;
	document.querySelectorAll('.view').forEach((section) => section.classList.remove('active-view'));
	document.querySelector(`#view-${view}`).classList.add('active-view');
	document.querySelectorAll('.nav-item[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
	document.getElementById('crumb-current').textContent = viewNames[view];
	if (subject) {
		activeQuestionSubject = subject;
		document.getElementById('subject-filter').value = subject;
		const profileTier = scienceSubjects.includes(subject) || subject === 'Combined Science' ? studentProfile?.scienceTier : studentProfile?.mathsTier;
		if (profileTier) document.getElementById('level-filter').value = profileTier;
	}
	if (view === 'practice') renderQuestions();
	if (view === 'curriculum') renderStudyGuides();
	if (view === 'notes') renderNotes();
	if (view === 'streak') renderStreakPage();
	if (view === 'flight') renderFlight();
	if (view === 'friends') renderFriends();
	if (view === 'profile') renderAvatar();
	if (view === 'artstudio') renderPortfolio('revise-rise-art-portfolio', 'art-portfolio');
	if (view === 'photostudio') renderPortfolio('revise-rise-photo-portfolio', 'photo-portfolio');
	if (view === 'musicstudio') renderMusicPortfolio();
	if (view === 'dramastudio') renderDramaPortfolio();
	if (view === 'settings') renderProfileSummary();
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHomeSubjects() {
	const selectedSubjects = getSelectedSubjects();
	const counts = Object.fromEntries(selectedSubjects.map((subject) => [subject, questions.filter((question) => question.subject === subject || (subject === 'Combined Science' && scienceSubjects.includes(question.subject))).length]));
	document.getElementById('subject-count').textContent = String(selectedSubjects.length).padStart(2, '0');
	document.getElementById('focus-subject-count').textContent = String(selectedSubjects.length);
	document.getElementById('home-subjects').innerHTML = selectedSubjects.map((subject) => `<button class="subject-card" data-subject="${subject}"><i class="subject-dot ${subjectClass(subject)}"></i><span class="subject-card-copy"><strong>${subject}</strong><small>${counts[subject]} revision ${counts[subject] === 1 ? 'guide' : 'guides'}</small></span><span class="card-arrow">↗</span></button>`).join('');
	renderSidebarSubjects();
	renderSubjectFilters();
}

function getSelectedSubjects() {
	if (!studentProfile) return [];
	if (studentProfile.showAllSubjects) return [...coreSubjects, ...scienceSubjects, ...optionSubjects];
	const selectedScience = studentProfile.scienceRoute === 'triple' ? scienceSubjects : ['Combined Science'];
	return [...coreSubjects, ...selectedScience, ...(studentProfile.options || [])];
}

function renderSidebarSubjects() {
	document.getElementById('sidebar-subjects').innerHTML = getSelectedSubjects().map((subject) => `<button class="subject-link" data-subject="${subject}"><i class="subject-dot ${subjectClass(subject)}"></i>${subject}</button>`).join('');
}

function renderSubjectFilters() {
	const selectedSubjects = getSelectedSubjects();
	const accessibleSubjects = [...new Set([...selectedSubjects, ...coreSubjects, ...scienceSubjects, ...optionSubjects])];
	const filter = document.getElementById('subject-filter');
	filter.innerHTML = '<option value="all">All subjects</option>' + accessibleSubjects.map((subject) => `<option>${subject}</option>`).join('');
	if (accessibleSubjects.includes(activeQuestionSubject)) filter.value = activeQuestionSubject;
	else { activeQuestionSubject = 'all'; filter.value = 'all'; }
	document.getElementById('level-filter').value = activeQuestionSubject === 'Biology' || activeQuestionSubject === 'Chemistry' || activeQuestionSubject === 'Physics' || activeQuestionSubject === 'Combined Science' ? (studentProfile?.scienceTier || 'foundation') : (studentProfile?.mathsTier || 'foundation');
}

function renderOptionSubjectChoices() {
	const options = studentProfile?.options || [];
	document.getElementById('option-subjects').innerHTML = optionSubjects.map((subject) => `<label class="option-choice"><input type="checkbox" name="option-subject" value="${subject}" ${options.includes(subject) ? 'checked' : ''}><span class="subject-dot ${subjectClass(subject)}"></span><span>${subject}</span></label>`).join('');
}

function openProfileSetup() {
	const profile = studentProfile || { yearGroup: '10', scienceRoute: 'combined', scienceTier: 'foundation', mathsTier: 'foundation', options: [] };
	document.querySelector(`input[name="year-group"][value="${profile.yearGroup}"]`).checked = true;
	document.querySelector(`input[name="science-route"][value="${profile.scienceRoute}"]`).checked = true;
	document.getElementById('science-tier').value = profile.scienceTier;
	document.getElementById('maths-tier').value = profile.mathsTier;
	document.getElementById('core-only').checked = false;
	renderOptionSubjectChoices();
	document.getElementById('setup-error').hidden = true;
	document.getElementById('subject-setup').hidden = false;
	updateCoreOnlyControl();
}

function updateCoreOnlyControl() {
	const coreOnly = document.getElementById('core-only').checked;
	document.querySelectorAll('input[name="option-subject"]').forEach((input) => { input.disabled = coreOnly; });
}

function saveStudentProfile() {
	const options = document.getElementById('core-only').checked ? [] : [...document.querySelectorAll('input[name="option-subject"]:checked')].map((input) => input.value);
	if (!options.length && !document.getElementById('core-only').checked) {
		document.getElementById('setup-error').hidden = false;
		return;
	}
	studentProfile = {
		yearGroup: document.querySelector('input[name="year-group"]:checked').value,
		scienceRoute: document.querySelector('input[name="science-route"]:checked').value,
		scienceTier: document.getElementById('science-tier').value,
		mathsTier: document.getElementById('maths-tier').value,
		options,
		showAllSubjects: studentProfile?.showAllSubjects || false
	};
	localStorage.setItem('studyroom-profile', JSON.stringify(studentProfile));
	activeYearGroup = studentProfile.yearGroup;
	document.getElementById('guide-tier-filter').value = studentProfile.scienceTier;
	document.getElementById('subject-setup').hidden = true;
	document.getElementById('year-focus-note').textContent = activeYearGroup === '10' ? 'Build understanding and collect examples as you go.' : 'Strengthen recall, exam technique and confidence.';
	renderHomeSubjects();
	renderProfileSummary();
	renderExamBoards();
	renderStreakPage();
	applyLanguage(safeRead('studyroom-language', 'en'));
}

function renderProfileSummary() {
	const profile = studentProfile;
	if (!profile) return;
	const science = profile.scienceRoute === 'triple' ? 'Triple Science' : 'Combined Science';
	document.getElementById('profile-summary').textContent = `Year ${profile.yearGroup} · Cottenham Village College · ${science} (${capitalize(profile.scienceTier)}) · Maths (${capitalize(profile.mathsTier)})`;
}

function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }

function renderStudyGuides() {
	const yearNote = document.getElementById('year-focus-note');
	yearNote.textContent = activeYearGroup === '10' ? 'Build understanding and collect examples as you go.' : 'Strengthen recall, exam technique and confidence.';
	document.querySelectorAll('[data-year-group]').forEach((button) => button.classList.toggle('selected', button.dataset.yearGroup === activeYearGroup));
	const showEverySubject = document.getElementById('guide-subject-filter').value === 'all';
	const guideSubjects = showEverySubject ? [...coreSubjects, ...scienceSubjects, ...optionSubjects] : getSelectedSubjects();
	document.getElementById('show-all-subjects').checked = Boolean(studentProfile?.showAllSubjects);
	const guideTier = document.getElementById('guide-tier-filter').value;
	document.getElementById('curriculum-guides').innerHTML = guideSubjects.map((subject) => {
		const topicQuestionSubjects = subject === 'Combined Science' ? scienceSubjects : [subject];
		const topicList = subject === 'Combined Science' ? scienceSubjects.flatMap((science) => subjectTopicGuides[science] || []) : subjectTopicGuides[subject] || [];
		const topicCards = topicList.map(([topic, rundown]) => {
			const question = questions.find((item) => topicQuestionSubjects.includes(item.subject) && item.topic === topic && (!item.tier || !['Maths', ...scienceSubjects].includes(item.subject) || item.tier === guideTier));
			const quiz = question ? `<button class="text-button guide-question" data-question-index="${questions.indexOf(question)}">Optional quiz <span>→</span></button>` : `<details class="topic-recall"><summary>Optional recall check</summary><p>Close your notes. Can you explain the main idea and give a precise example?</p><details><summary>Check your rundown</summary><p>${rundown}</p></details></details>`;
			return `<details class="guide-topic"><summary>${topic}<span>Year ${activeYearGroup} · Rundown</span></summary><p>${rundown}</p>${quiz}</details>`;
		}).join('');
		return `<article class="guide-card"><div class="guide-card-head"><i class="subject-dot ${subjectClass(subject)}"></i><span class="guide-level">YEAR ${activeYearGroup} · ${guideTier.toUpperCase()} GUIDE</span></div><h2>${subject}</h2><p>${studyTips[subject] || 'Review key vocabulary, practise one task and connect it to your current class unit.'}</p>${subject === 'Art' || subject === 'Photography' ? `<div class="creative-tip"><strong>${subject === 'Art' ? 'Studio tip' : 'Photo tip'}</strong><span>${studyTips[subject]}</span></div>` : ''}<div class="guide-topic-list">${topicCards || '<p class="guide-empty">Topic guides for this subject are being prepared.</p>'}</div></article>`;
	}).join('');
}

function searchRevisionHelper(query) {
	const output = document.getElementById('helper-answer');
	const terms = query.toLowerCase().trim().split(/\s+/).filter((term) => term.length > 2);
	if (!terms.length) {
		output.innerHTML = '<p>Type a topic or question, such as “how does osmosis work?” or “compare poems”.</p>';
		return;
	}
	const results = Object.entries(subjectTopicGuides).flatMap(([subject, topics]) => topics.map(([topic, rundown]) => ({ subject, topic, rundown }))).filter((entry) => {
		const haystack = `${entry.subject} ${entry.topic} ${entry.rundown}`.toLowerCase();
		return terms.some((term) => haystack.includes(term));
	}).slice(0, 5);
	if (!results.length) {
		output.innerHTML = '<p>I could not find that topic in the built-in guide. Try a shorter keyword or browse the full subject guides.</p><a href="https://www.bbc.co.uk/bitesize/levels/z98jmp3" target="_blank" rel="noopener noreferrer">Browse BBC Bitesize GCSE ↗</a>';
		return;
	}
	output.innerHTML = results.map((result) => `<article class="helper-result"><span class="eyebrow">${result.subject.toUpperCase()} · ${result.topic.toUpperCase()}</span><p>${result.rundown}</p><button class="text-button helper-practice" data-helper-subject="${result.subject}">Open ${result.subject} guides <span>→</span></button></article>`).join('');
}

function classifyVoiceRange(lowHz, highHz) {
	const lowMidi = Math.round(69 + 12 * Math.log2(lowHz / 440));
	const highMidi = Math.round(69 + 12 * Math.log2(highHz / 440));
	if (highMidi - lowMidi < 7) return 'Keep exploring gently; sample a few more comfortable notes before estimating a range type.';
	const categories = [
		['Soprano', 60, 89], ['Mezzo-soprano', 57, 81], ['Alto / contralto', 53, 77],
		['Tenor', 48, 69], ['Baritone', 43, 64], ['Bass', 40, 64]
	];
	const possible = categories.filter(([, low, high]) => lowMidi >= low && highMidi <= high).map(([name]) => name);
	if (possible.length) return `Possible vocal range: ${possible.join(' / ')} (rough estimate from sampled notes).`;
	return `Sampled ${pitchName(lowHz)} to ${pitchName(highHz)}. This may span more than one range category; a music teacher can help identify comfortable tessitura.`;
}

document.getElementById('today-label').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase();

function applyLanguage(language) {
	const translations = {
		en: { navOverview: 'Overview', navGuides: 'Study guides', navQuestions: 'Question bank', navLab: 'Science lab', navCode: 'Code studio', navNotes: 'My notes', navStreak: 'Daily streak', navFlight: 'Study flight', navCrew: 'Friends & crew', navAvatar: 'Avatar & account', homeTitle: 'Make today count.', homeIntro: 'A little progress, in every subject. Pick up where you are.', subjectsLabel: 'SUBJECTS', readFirst: 'READ FIRST', showQuestion: 'I have read this · show question', searchPlaceholder: 'Search subjects, topics, questions...', languageNote: 'Some navigation and reading controls are available in English, Spanish, Polish and Arabic. Study questions and readings are currently in English.' },
		es: { navOverview: 'Resumen', navGuides: 'Guías de estudio', navQuestions: 'Preguntas', navLab: 'Laboratorio', navCode: 'Taller de código', navNotes: 'Mis apuntes', navStreak: 'Racha diaria', navFlight: 'Vuelo de estudio', navCrew: 'Amistades', navAvatar: 'Avatar y cuenta', homeTitle: 'Haz que hoy cuente.', homeIntro: 'Un pequeño avance en cada asignatura. Continúa desde donde estás.', subjectsLabel: 'ASIGNATURAS', readFirst: 'LEE ANTES', showQuestion: 'Ya lo he leído · mostrar pregunta', searchPlaceholder: 'Buscar asignaturas, temas y preguntas...', languageNote: 'Algunos menús y controles de lectura están disponibles en inglés, español, polaco y árabe. Las preguntas y lecturas están en inglés.' },
		pl: { navOverview: 'Przegląd', navGuides: 'Poradniki', navQuestions: 'Pytania', navLab: 'Laboratorium', navCode: 'Studio kodu', navNotes: 'Moje notatki', navStreak: 'Codzienna passa', navFlight: 'Lot naukowy', navCrew: 'Znajomi i ekipa', navAvatar: 'Awatar i konto', homeTitle: 'Wykorzystaj dzisiejszy dzień.', homeIntro: 'Mały postęp w każdym przedmiocie. Kontynuuj naukę.', subjectsLabel: 'PRZEDMIOTY', readFirst: 'NAJPIERW PRZECZYTAJ', showQuestion: 'Przeczytane · pokaż pytanie', searchPlaceholder: 'Szukaj przedmiotów, tematów i pytań...', languageNote: 'Niektóre menu i narzędzia do czytania są dostępne po angielsku, hiszpańsku, polsku i arabsku. Pytania i teksty do nauki są obecnie po angielsku.' },
		ar: { navOverview: 'نظرة عامة', navGuides: 'أدلة الدراسة', navQuestions: 'بنك الأسئلة', navLab: 'مختبر العلوم', navCode: 'استوديو البرمجة', navNotes: 'ملاحظاتي', navStreak: 'المواظبة اليومية', navFlight: 'رحلة الدراسة', navCrew: 'الأصدقاء والفريق', navAvatar: 'الصورة والحساب', homeTitle: 'اجعل يومك مهماً.', homeIntro: 'تقدم بسيط في كل مادة. تابع من حيث توقفت.', subjectsLabel: 'المواد', readFirst: 'اقرأ أولاً', showQuestion: 'قرأت هذا · أظهر السؤال', searchPlaceholder: 'ابحث عن المواد والموضوعات والأسئلة...', languageNote: 'تتوفر بعض القوائم وأدوات القراءة بالإنجليزية والإسبانية والبولندية والعربية. الأسئلة ونصوص الدراسة متاحة حالياً بالإنجليزية.' }
	};
	const strings = translations[language] || translations.en;
	document.documentElement.lang = language;
	document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
	document.querySelectorAll('[data-i18n]').forEach((element) => {
		const translation = strings[element.dataset.i18n];
		if (translation) element.textContent = translation;
	});
	document.getElementById('global-search').placeholder = strings.searchPlaceholder;
	document.querySelectorAll('.question-reading .eyebrow').forEach((element) => { element.textContent = `${strings.readFirst} · ${element.dataset.topicTitle || ''}`; });
	document.querySelectorAll('.reveal-question').forEach((button) => { button.textContent = strings.showQuestion; });
	document.getElementById('language-select').value = language;
	const setupLanguage = document.getElementById('setup-language');
	if (setupLanguage) setupLanguage.value = language;
	localStorage.setItem('studyroom-language', language);
}

function applyReadingPreferences(preferences = safeRead('studyroom-reading', { font: 'standard', size: 16, spacing: 'comfortable', tone: 'paper', ruler: false })) {
	document.body.dataset.readingFont = preferences.font;
	document.body.dataset.textTone = preferences.tone;
	document.documentElement.style.setProperty('--reading-size', `${preferences.size}px`);
	document.body.classList.toggle('spacious-reading', preferences.spacing === 'spacious');
	document.getElementById('readable-font').checked = preferences.font === 'clear';
	document.getElementById('font-size-range').value = preferences.size;
	document.getElementById('font-size-value').textContent = `${preferences.size} px`;
	document.getElementById('line-spacing-select').value = preferences.spacing;
	document.getElementById('reading-guide-setting').checked = preferences.ruler;
	document.querySelectorAll('[data-text-tone]').forEach((button) => button.classList.toggle('selected', button.dataset.textTone === preferences.tone));
	setReadingRuler(preferences.ruler);
}

function updateReadingPreference(key, value) {
	const preferences = safeRead('studyroom-reading', { font: 'standard', size: 16, spacing: 'comfortable', tone: 'paper', ruler: false });
	preferences[key] = value;
	localStorage.setItem('studyroom-reading', JSON.stringify(preferences));
	applyReadingPreferences(preferences);
}

function setReadingRuler(enabled) {
	const ruler = document.getElementById('reading-ruler');
	ruler.classList.toggle('visible', enabled);
	ruler.setAttribute('aria-hidden', String(!enabled));
	document.getElementById('toggle-reading-guide').setAttribute('aria-pressed', String(enabled));
}

function subjectClass(subject) {
	return { Art: 'art-dot', Photography: 'photography-dot', 'English Language': 'english-dot', 'English Literature': 'literature-dot', 'Computer Science': 'computer-dot', Chemistry: 'chemistry-dot', Physics: 'physics-dot', Biology: 'biology-dot', 'Combined Science': 'science-dot', Maths: 'maths-dot', History: 'history-dot', Geography: 'geography-dot', 'Religious Education': 're-dot', 'Food Technology': 'food-dot', 'Design & Technology': 'dt-dot', French: 'language-dot', Spanish: 'language-dot', Music: 'music-dot', Drama: 'drama-dot' }[subject] || '';
}

function renderQuestions() {
	const year = document.getElementById('year-filter').value;
	const tier = document.getElementById('level-filter').value;
	const search = document.getElementById('global-search').value.trim().toLowerCase();
	const showTierFilter = ['Maths', ...scienceSubjects, 'Combined Science'].includes(activeQuestionSubject);
	const filtered = questions.filter((question) => {
		const matchesSubject = activeQuestionSubject === 'all' || question.subject === activeQuestionSubject || (activeQuestionSubject === 'Combined Science' && scienceSubjects.includes(question.subject));
		const matchesYear = year === 'all' || String(question.year) === year;
		const matchesTier = !showTierFilter || tier === 'all' || !question.tier || question.tier === tier;
		const haystack = `${question.subject} ${question.topic} ${question.prompt} ${(question.options || []).join(' ')}`.toLowerCase();
		return matchesSubject && matchesYear && matchesTier && (!search || haystack.includes(search));
	});
	document.getElementById('result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'question' : 'questions'}`;
	document.getElementById('nav-question-count').textContent = String(questions.length);
	const tierWrap = document.getElementById('tier-filter-wrap');
	tierWrap.hidden = !['Maths', ...scienceSubjects, 'Combined Science'].includes(activeQuestionSubject);
	document.getElementById('question-list').innerHTML = filtered.length ? filtered.map((question) => {
		const index = questions.indexOf(question);
		const reading = topicReadings[question.topic] || 'Review this topic in your notes, identify the key terms and connect the idea to a clear example before answering.';
		const board = socialProfile.examBoards[question.subject];
		const boardLabel = board ? `${board} selected · original GCSE style` : 'GCSE STYLE · ORIGINAL PRACTICE';
		return `<article class="question-card" data-question="${index}"><div class="question-top"><span class="question-subject">${question.subject.toUpperCase()}</span><span class="question-topic">· ${question.topic}${question.tier ? ' · ' + question.tier.toUpperCase() + ' TIER' : ''}</span><span class="question-year">${question.year} · ${boardLabel}</span></div><section class="question-reading"><p class="eyebrow" data-topic-title="${question.topic.toUpperCase()}">READ FIRST · ${question.topic.toUpperCase()}</p><p>${reading}</p><button class="button button-outline reveal-question" data-question="${index}">I've read this · show question</button></section>${renderQuestionTask(question, index)}</article>`;
	}).join('') : '<div class="empty-state">No matching questions. Try a different subject, year, or search.</div>';
	const language = safeRead('studyroom-language', 'en');
	const strings = { en: { readFirst: 'READ FIRST', showQuestion: 'I have read this · show question' }, es: { readFirst: 'LEE ANTES', showQuestion: 'Ya lo he leído · mostrar pregunta' }, pl: { readFirst: 'NAJPIERW PRZECZYTAJ', showQuestion: 'Przeczytane · pokaż pytanie' }, ar: { readFirst: 'اقرأ أولاً', showQuestion: 'قرأت هذا · أظهر السؤال' } }[language] || { readFirst: 'READ FIRST', showQuestion: 'I have read this · show question' };
	document.querySelectorAll('.question-reading .eyebrow').forEach((element) => { element.textContent = `${strings.readFirst} · ${element.dataset.topicTitle}`; });
	document.querySelectorAll('.reveal-question').forEach((button) => { button.textContent = strings.showQuestion; });
}

function renderQuestionTask(question, index) {
	if (question.type === 'written') return `<div class="question-task" hidden><p class="question-text">${question.prompt} <span class="mark-value">[${question.maxMarks} marks]</span></p><textarea class="theory-response" rows="5" maxlength="1800" placeholder="Write your explanation in your own words..." aria-label="Your theory answer"></textarea><div class="theory-submit-row"><span>Estimated keyword-based practice marking</span><button class="button button-dark submit-theory" data-question="${index}">Mark my response <span>✓</span></button></div><div class="answer-feedback" hidden></div></div>`;
	return `<div class="question-task" hidden><p class="question-text">${question.prompt}</p><div class="answer-options">${question.options.map((option, optionIndex) => `<button class="answer-option" data-question="${index}" data-option="${optionIndex}"><span class="option-letter">${String.fromCharCode(65 + optionIndex)}</span><span>${option}</span></button>`).join('')}</div><div class="answer-feedback" hidden></div></div>`;
}

function markTheoryAnswer(button) {
	const card = button.closest('.question-card');
	if (!card || card.dataset.answered) return;
	const question = questions[Number(button.dataset.question)];
	const response = card.querySelector('.theory-response').value.trim();
	const normalized = response.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ');
	const words = normalized.split(' ').filter(Boolean);
	const matched = question.keywordGroups.filter((group) => group.some((keyword) => normalized.includes(keyword.toLowerCase())));
	const missing = question.keywordGroups.filter((group) => !group.some((keyword) => normalized.includes(keyword.toLowerCase())));
	const reasoning = /\b(because|therefore|this means|this shows|as a result|which means|since|so that)\b/.test(normalized);
	let marks = matched.length;
	if (words.length < 6) marks = 0;
	else if (words.length < question.maxMarks * 4 || !reasoning) marks = Math.min(marks, question.maxMarks - 1);
	marks = Math.min(question.maxMarks, marks);
	card.dataset.answered = 'true';
	card.querySelector('.theory-response').disabled = true;
	button.disabled = true;
	const feedback = card.querySelector('.answer-feedback');
	const matchedText = matched.map((group) => group[0]).join(', ') || 'No key ideas matched yet';
	const missingText = missing.map((group) => group[0]).join(', ') || 'No core keywords missing';
	feedback.hidden = false;
	feedback.innerHTML = `<strong>Estimated practice mark: ${marks} / ${question.maxMarks}</strong><p>Ideas spotted: ${escapeHTML(matchedText)}.</p><p>Consider adding: ${escapeHTML(missingText)}.</p><p>${!reasoning ? 'Link ideas with a reason, such as “because” or “this means”. ' : ''}This is a keyword-based study estimate, not an official examiner mark.</p><details><summary>Example points to include</summary><p>${question.modelAnswer}</p></details>`;
	addStudyTime((Date.now() - Number(card.dataset.startedAt || Date.now())) / 1000, question.subject, marks >= Math.ceil(question.maxMarks / 2));
}

function answerQuestion(button) {
	const card = button.closest('.question-card');
	if (!card || card.dataset.answered) return;
	const question = questions[Number(button.dataset.question)];
	const selected = Number(button.dataset.option);
	const elapsedSeconds = (Date.now() - Number(card.dataset.startedAt || Date.now())) / 1000;
	const correct = selected === question.answer;
	const feedback = card.querySelector('.answer-feedback');
	card.dataset.answered = 'true';
	card.querySelectorAll('.answer-option').forEach((option) => {
		option.disabled = true;
		if (Number(option.dataset.option) === question.answer) option.classList.add('correct');
		else if (option === button) option.classList.add('incorrect');
	});
	feedback.hidden = false;
	feedback.innerHTML = `<strong>${correct ? 'That’s right.' : 'Not quite. The correct answer is ' + String.fromCharCode(65 + question.answer) + '.'}</strong><p>${question.explanation}</p><p class="answer-time">Time on question: ${formatClock(Math.floor(elapsedSeconds))}</p>`;
	addStudyTime(elapsedSeconds, question.subject, correct);
}

function renderPracticals() {
	document.getElementById('lab-grid').innerHTML = practicals.map((practical, index) => `<article class="lab-card"><div class="lab-card-head"><span class="lab-subject">${practical.subject}</span><span class="lab-time">${practical.time}</span></div><h2>${practical.title}</h2><p>${practical.intro}</p><div class="lab-materials"><b>YOU WILL NEED</b><br>${practical.materials}</div><details><summary class="text-button">Show the steps <span>↓</span></summary><ol class="lab-steps">${practical.steps.map((step) => `<li>${step}</li>`).join('')}</ol><p class="lab-result"><b>What might you find?</b><br>${practical.result}</p></details></article>`).join('');
}

function updatePendulum() {
	const length = Number(document.getElementById('length-range').value);
	const period = 2 * Math.PI * Math.sqrt((length / 100) / 9.81);
	document.getElementById('length-value').textContent = `${length} cm`;
	document.getElementById('period-value').textContent = `${period.toFixed(2)} s`;
	document.getElementById('pendulum-string').style.height = `${Math.round(45 + length * 1.2)}px`;
	document.getElementById('pendulum-string').style.setProperty('--swing-duration', `${Math.max(.55, period)}s`);
}

function renderNotes() {
	const notes = safeRead('studyroom-notes', []);
	const list = document.getElementById('notes-list');
	if (!notes.some((note) => note.id === currentNoteId)) currentNoteId = notes[0]?.id ?? null;
	populateNotesFolders(notes);
	const visibleNotes = activeNoteFolder === 'all' ? notes : notes.filter((note) => (note.subject || 'General') === activeNoteFolder);
	list.innerHTML = visibleNotes.length ? visibleNotes.map((note) => `<button class="note-list-item ${note.id === currentNoteId ? 'active' : ''}" data-note-id="${note.id}"><strong>${escapeHTML(note.title || 'Untitled note')}</strong><span>${escapeHTML(note.subject || 'General')} · ${formatDate(note.updated)}</span></button>`).join('') : '<div class="notes-empty">No notes in this folder yet.<br>Use + to add one.</div>';
	const note = notes.find((item) => item.id === currentNoteId);
	document.getElementById('note-title').value = note?.title ?? '';
	document.getElementById('note-body').value = note?.body ?? '';
	document.getElementById('note-subject').value = note?.subject ?? 'General';
	document.getElementById('note-subject-label').textContent = (note?.subject ?? 'General').toUpperCase();
	document.getElementById('delete-note').disabled = !note;
	document.getElementById('note-status').textContent = note ? 'Changes save automatically' : 'Create a note to begin';
}

function populateNotesFolders(notes = safeRead('studyroom-notes', [])) {
	const folderSelect = document.getElementById('notes-folder');
	const noteSelect = document.getElementById('note-subject');
	const names = [...new Set([...coreSubjects, ...scienceSubjects, ...optionSubjects, ...notes.map((note) => note.subject).filter(Boolean)])];
	folderSelect.innerHTML = '<option value="all">All subjects</option><option>General</option>' + names.map((subject) => `<option>${escapeHTML(subject)}</option>`).join('');
	noteSelect.innerHTML = '<option>General</option>' + names.map((subject) => `<option>${escapeHTML(subject)}</option>`).join('');
	folderSelect.value = names.includes(activeNoteFolder) || activeNoteFolder === 'General' ? activeNoteFolder : 'all';
}

function escapeHTML(value) {
	return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function formatDate(value) {
	const date = new Date(value || Date.now());
	return Number.isNaN(date.getTime()) ? 'Just now' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function saveCurrentNote() {
	const notes = safeRead('studyroom-notes', []);
	const note = notes.find((item) => item.id === currentNoteId);
	if (!note) return;
	note.title = document.getElementById('note-title').value;
	note.body = document.getElementById('note-body').value;
	note.subject = document.getElementById('note-subject').value;
	activeNoteFolder = note.subject;
	note.updated = new Date().toISOString();
	localStorage.setItem('studyroom-notes', JSON.stringify(notes));
	document.getElementById('note-subject-label').textContent = note.subject.toUpperCase();
	document.getElementById('note-status').textContent = 'Saved just now';
	renderNotesListOnly(notes);
}

function renderNotesListOnly(notes = safeRead('studyroom-notes', [])) {
	const list = document.getElementById('notes-list');
	populateNotesFolders(notes);
	const visibleNotes = activeNoteFolder === 'all' ? notes : notes.filter((note) => (note.subject || 'General') === activeNoteFolder);
	list.innerHTML = visibleNotes.length ? visibleNotes.map((note) => `<button class="note-list-item ${note.id === currentNoteId ? 'active' : ''}" data-note-id="${note.id}"><strong>${escapeHTML(note.title || 'Untitled note')}</strong><span>${escapeHTML(note.subject || 'General')} · ${formatDate(note.updated)}</span></button>`).join('') : '<div class="notes-empty">No notes in this folder yet.<br>Use + to add one.</div>';
}

function createNote() {
	const notes = safeRead('studyroom-notes', []);
	const note = { id: crypto.randomUUID(), title: '', body: '', subject: activeNoteFolder === 'all' ? 'General' : activeNoteFolder, updated: new Date().toISOString() };
	notes.unshift(note);
	localStorage.setItem('studyroom-notes', JSON.stringify(notes));
	currentNoteId = note.id;
	renderNotes();
	document.getElementById('note-title').focus();
}

function deleteCurrentNote() {
	if (!currentNoteId) return;
	const notes = safeRead('studyroom-notes', []).filter((note) => note.id !== currentNoteId);
	localStorage.setItem('studyroom-notes', JSON.stringify(notes));
	currentNoteId = notes[0]?.id ?? null;
	renderNotes();
}

function applyPreferences(preferences = safeRead('studyroom-appearance', { mode: 'light', accent: 'green', wallpaper: 'grid' })) {
	document.body.dataset.mode = preferences.mode;
	document.body.dataset.accent = preferences.accent;
	document.body.dataset.wallpaper = preferences.wallpaper;
	document.querySelectorAll('[data-mode]').forEach((button) => button.classList.toggle('selected', button.dataset.mode === preferences.mode));
	document.querySelectorAll('[data-accent]').forEach((button) => button.classList.toggle('selected', button.dataset.accent === preferences.accent));
	document.querySelectorAll('[data-wallpaper]').forEach((button) => button.classList.toggle('selected', button.dataset.wallpaper === preferences.wallpaper));
}

function setPreference(key, value) {
	const preferences = safeRead('studyroom-appearance', { mode: 'light', accent: 'green', wallpaper: 'grid' });
	preferences[key] = value;
	localStorage.setItem('studyroom-appearance', JSON.stringify(preferences));
	applyPreferences(preferences);
}

function runCodePreview() {
	const source = document.getElementById('code-editor').value;
	const safeSource = source.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '').replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '').replace(/\s(?:src|href)\s*=\s*(["'])\s*(?:javascript:|https?:|\/\/)[\s\S]*?\1/gi, '');
	document.getElementById('code-preview').srcdoc = safeSource;
}

document.querySelectorAll('.nav-item[data-view], .top-theme').forEach((button) => button.addEventListener('click', () => goToView(button.dataset.view)));
document.getElementById('sidebar-subjects').addEventListener('click', (event) => {
	const button = event.target.closest('[data-subject]');
	if (button) goToView('practice', button.dataset.subject);
});
document.getElementById('home-subjects').addEventListener('click', (event) => {
	const button = event.target.closest('[data-subject]');
	if (button) goToView('practice', button.dataset.subject);
});
document.querySelectorAll('[data-view]:not(.nav-item):not(.top-theme)').forEach((button) => button.addEventListener('click', () => goToView(button.dataset.view)));
document.getElementById('start-featured').addEventListener('click', () => goToView('practice', 'Biology'));
document.getElementById('subject-filter').addEventListener('change', (event) => {
	activeQuestionSubject = event.target.value;
	const tier = scienceSubjects.includes(activeQuestionSubject) || activeQuestionSubject === 'Combined Science' ? studentProfile?.scienceTier : studentProfile?.mathsTier;
	if (tier) document.getElementById('level-filter').value = tier;
	renderQuestions();
});
document.getElementById('year-filter').addEventListener('change', renderQuestions);
document.getElementById('level-filter').addEventListener('change', renderQuestions);
document.getElementById('guide-tier-filter').addEventListener('change', renderStudyGuides);
document.getElementById('guide-subject-filter').addEventListener('change', renderStudyGuides);
document.querySelectorAll('[data-year-group]').forEach((button) => button.addEventListener('click', () => {
	activeYearGroup = button.dataset.yearGroup;
	if (studentProfile) {
		studentProfile.yearGroup = activeYearGroup;
		localStorage.setItem('studyroom-profile', JSON.stringify(studentProfile));
	}
	renderStudyGuides();
	renderProfileSummary();
}));
document.getElementById('show-all-subjects').addEventListener('change', (event) => {
	if (!studentProfile) return;
	studentProfile.showAllSubjects = event.target.checked;
	localStorage.setItem('studyroom-profile', JSON.stringify(studentProfile));
	renderHomeSubjects();
	renderStudyGuides();
});
document.getElementById('edit-profile').addEventListener('click', openProfileSetup);
document.getElementById('save-profile').addEventListener('click', saveStudentProfile);
document.getElementById('core-only').addEventListener('change', updateCoreOnlyControl);
document.getElementById('language-select').addEventListener('change', (event) => applyLanguage(event.target.value));
document.getElementById('setup-language').addEventListener('change', (event) => applyLanguage(event.target.value));
document.getElementById('readable-font').addEventListener('change', (event) => updateReadingPreference('font', event.target.checked ? 'clear' : 'standard'));
document.getElementById('font-size-range').addEventListener('input', (event) => updateReadingPreference('size', Number(event.target.value)));
document.getElementById('line-spacing-select').addEventListener('change', (event) => updateReadingPreference('spacing', event.target.value));
document.getElementById('reading-guide-setting').addEventListener('change', (event) => updateReadingPreference('ruler', event.target.checked));
document.querySelectorAll('[data-text-tone]').forEach((button) => button.addEventListener('click', () => updateReadingPreference('tone', button.dataset.textTone)));
document.getElementById('toggle-reading-guide').addEventListener('click', () => {
	const preferences = safeRead('studyroom-reading', { font: 'standard', size: 16, spacing: 'comfortable', tone: 'paper', ruler: false });
	updateReadingPreference('ruler', !preferences.ruler);
});
document.addEventListener('pointermove', (event) => {
	const ruler = document.getElementById('reading-ruler');
	if (ruler.classList.contains('visible')) ruler.style.top = `${event.clientY}px`;
});
document.getElementById('guide-subject-filter').addEventListener('change', renderStudyGuides);
document.getElementById('curriculum-guides').addEventListener('click', (event) => {
	const questionButton = event.target.closest('[data-question-index]');
	const subjectButton = event.target.closest('[data-subject]');
	if (questionButton) {
		const question = questions[Number(questionButton.dataset.questionIndex)];
		goToView('practice', question.subject);
		return;
	}
	if (subjectButton) goToView('practice', subjectButton.dataset.subject);
});
document.getElementById('global-search').addEventListener('input', () => {
	if (currentView !== 'practice') goToView('practice');
	renderQuestions();
});
document.addEventListener('keydown', (event) => {
	if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); document.getElementById('global-search').focus(); }
	if (event.key === 'Escape' && document.activeElement === document.getElementById('global-search')) { document.getElementById('global-search').value = ''; renderQuestions(); document.activeElement.blur(); }
});
document.getElementById('question-list').addEventListener('click', (event) => {
	const revealButton = event.target.closest('.reveal-question');
	if (revealButton) {
		const card = revealButton.closest('.question-card');
		card.dataset.startedAt = String(Date.now());
		card.querySelector('.question-task').hidden = false;
		revealButton.disabled = true;
		return;
	}
	const theoryButton = event.target.closest('.submit-theory');
	if (theoryButton) {
		markTheoryAnswer(theoryButton);
		return;
	}
	const button = event.target.closest('.answer-option');
	if (button) answerQuestion(button);
});
document.getElementById('length-range').addEventListener('input', updatePendulum);
document.getElementById('swing-button').addEventListener('click', () => {
	const string = document.getElementById('pendulum-string');
	string.classList.remove('swinging');
	requestAnimationFrame(() => string.classList.add('swinging'));
});
document.getElementById('code-editor').value = codeStarter;
document.getElementById('run-code').addEventListener('click', runCodePreview);
document.getElementById('reset-code').addEventListener('click', () => { document.getElementById('code-editor').value = codeStarter; runCodePreview(); });
document.getElementById('demo-click').addEventListener('click', () => {
	const count = document.getElementById('click-count');
	count.textContent = String(Number(count.textContent) + 1);
});
document.getElementById('new-note').addEventListener('click', createNote);
document.getElementById('notes-folder').addEventListener('change', (event) => {
	activeNoteFolder = event.target.value;
	const notes = safeRead('studyroom-notes', []);
	if (activeNoteFolder !== 'all' && !notes.some((note) => note.id === currentNoteId && (note.subject || 'General') === activeNoteFolder)) {
		currentNoteId = notes.find((note) => (note.subject || 'General') === activeNoteFolder)?.id ?? null;
	}
	renderNotes();
});
document.getElementById('notes-list').addEventListener('click', (event) => {
	const button = event.target.closest('[data-note-id]');
	if (!button) return;
	clearTimeout(noteSaveTimer);
	saveCurrentNote();
	currentNoteId = button.dataset.noteId;
	renderNotes();
});
['note-title', 'note-body', 'note-subject'].forEach((id) => document.getElementById(id).addEventListener('input', () => {
	document.getElementById('note-status').textContent = 'Saving...';
	clearTimeout(noteSaveTimer);
	noteSaveTimer = setTimeout(saveCurrentNote, 300);
}));
document.getElementById('delete-note').addEventListener('click', deleteCurrentNote);
document.getElementById('daily-goal').addEventListener('change', (event) => {
	const progress = readProgress();
	progress.goalMinutes = Number(event.target.value);
	writeProgress(progress);
	renderStreakPage();
});
document.getElementById('random-flight').addEventListener('click', randomFlight);
document.getElementById('flight-destination').addEventListener('change', renderFlight);
document.getElementById('flight-duration').addEventListener('change', renderFlight);
document.getElementById('start-flight').addEventListener('click', startFlight);
document.getElementById('pause-flight').addEventListener('click', pauseFlight);
document.getElementById('end-flight').addEventListener('click', () => finishFlight(false));
document.getElementById('skip-break').addEventListener('click', resumeAfterBreak);
document.getElementById('add-friend-form').addEventListener('submit', (event) => {
	event.preventDefault();
	const input = document.getElementById('friend-username');
	const feedback = document.getElementById('friend-feedback');
	if (addFriend(input.value)) {
		feedback.textContent = 'Added to your local crew.';
		input.value = '';
	} else feedback.textContent = 'Enter a unique username that is not your own.';
});
document.getElementById('friends-list').addEventListener('change', (event) => {
	const username = event.target.dataset.friendStudy;
	if (username) {
		const friend = socialProfile.friends.find((item) => item.username === username);
		if (friend) friend.studying = event.target.checked;
		saveSocialProfile();
		renderFriends();
	}
});
document.getElementById('friends-list').addEventListener('input', (event) => {
	const username = event.target.dataset.friendMinutes;
	if (!username) return;
	const friend = socialProfile.friends.find((item) => item.username === username);
	if (friend) {
		friend.minutes = Math.max(0, Math.min(9999, Number(event.target.value) || 0));
		saveSocialProfile();
		renderLeaderboard();
	}
});
document.getElementById('friends-list').addEventListener('click', (event) => {
	const username = event.target.dataset.removeFriend;
	if (!username) return;
	socialProfile.friends = socialProfile.friends.filter((friend) => friend.username !== username);
	saveSocialProfile();
	renderFriends();
});
document.getElementById('save-username').addEventListener('click', () => {
	const username = document.getElementById('profile-username').value.trim();
	const status = document.getElementById('account-status');
	if (!/^[A-Za-z0-9_.-]{3,24}$/.test(username)) {
		status.textContent = 'Use 3–24 letters, numbers, dots, dashes or underscores.';
		return;
	}
	socialProfile.username = username;
	saveSocialProfile();
	status.textContent = `Username saved on this device as ${username}.`;
	renderLeaderboard();
});
document.getElementById('avatar-choices').addEventListener('click', (event) => {
	const avatar = event.target.closest('[data-avatar]')?.dataset.avatar;
	if (!avatar) return;
	socialProfile.avatar = avatar;
	saveSocialProfile();
	renderAvatar();
});
document.getElementById('avatar-colours').addEventListener('click', (event) => {
	const color = event.target.closest('[data-avatar-color]')?.dataset.avatarColor;
	if (!color) return;
	socialProfile.avatarColor = color;
	saveSocialProfile();
	renderAvatar();
});
document.getElementById('avatar-shop').addEventListener('click', (event) => {
	const item = shopItems.find((shopItem) => shopItem.id === event.target.closest('[data-shop-item]')?.dataset.shopItem);
	if (!item) return;
	const progress = readProgress();
	if (!socialProfile.inventory.includes(item.id)) {
		if (progress.coins < item.cost) return;
		progress.coins -= item.cost;
		writeProgress(progress);
		socialProfile.inventory.push(item.id);
	}
	socialProfile.accessory = socialProfile.accessory === item.id ? '' : item.id;
	saveSocialProfile();
	renderAvatar();
});
document.getElementById('exam-board-list').addEventListener('change', (event) => {
	const subject = event.target.dataset.examSubject;
	if (!subject) return;
	socialProfile.examBoards[subject] = event.target.value;
	saveSocialProfile();
});
document.querySelectorAll('[data-auth-provider]').forEach((button) => button.addEventListener('click', () => {
	document.getElementById('account-status').textContent = `${button.dataset.authProvider} sign-in is not connected yet. This page will not ask for or store passwords.`;
}));
document.getElementById('continue-guest').addEventListener('click', () => {
	document.getElementById('account-status').textContent = 'Guest mode is active. Your progress stays in this browser on this device.';
});
initializeArtCanvas();
initializePhotoStudio();
initializeMusicStudio();
initializeDramaStudio();
initializeVoiceRange();
document.getElementById('ask-helper').addEventListener('click', () => searchRevisionHelper(document.getElementById('helper-question').value));
document.getElementById('helper-question').addEventListener('keydown', (event) => {
	if (event.key === 'Enter') searchRevisionHelper(event.currentTarget.value);
});
document.getElementById('helper-answer').addEventListener('click', (event) => {
	const button = event.target.closest('[data-helper-subject]');
	if (!button) return;
	document.getElementById('guide-subject-filter').value = 'all';
	goToView('curriculum');
});
document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => setPreference('mode', button.dataset.mode)));
document.querySelectorAll('[data-accent]').forEach((button) => button.addEventListener('click', () => setPreference('accent', button.dataset.accent)));
document.querySelectorAll('[data-wallpaper]').forEach((button) => button.addEventListener('click', () => setPreference('wallpaper', button.dataset.wallpaper)));
document.getElementById('reset-settings').addEventListener('click', () => {
	const defaults = { mode: 'light', accent: 'green', wallpaper: 'grid' };
	localStorage.setItem('studyroom-appearance', JSON.stringify(defaults));
	applyPreferences(defaults);
});

document.getElementById('note-subject').innerHTML = '<option>General</option>' + [...new Set([...coreSubjects, ...scienceSubjects, ...optionSubjects])].map((subject) => `<option>${subject}</option>`).join('');
document.getElementById('guide-tier-filter').value = studentProfile?.scienceTier || 'foundation';
document.getElementById('guide-subject-filter').value = 'selected';
const savedLanguage = safeRead('studyroom-language', 'en');
claimDailyLoginReward();
applyLanguage(savedLanguage);
applyReadingPreferences();
renderOptionSubjectChoices();
renderHomeSubjects();
renderQuestions();
renderPracticals();
renderStreakPage();
renderSocialViews();
updatePendulum();
applyPreferences();
runCodePreview();
if (!studentProfile) openProfileSetup();
else {
	activeYearGroup = studentProfile.yearGroup || '10';
	renderProfileSummary();
}

function showCookieNotice() {
	document.getElementById('cookie-notice').hidden = false;
	document.getElementById('accept-essential-cookies').focus();
}

function acceptEssentialCookies() {
	try { document.cookie = 'revise-rise-consent=essential; Max-Age=31536000; Path=/; SameSite=Lax'; } catch {}
	localStorage.setItem('revise-rise-consent', 'essential');
	document.getElementById('cookie-notice').hidden = true;
}

document.getElementById('accept-essential-cookies').addEventListener('click', acceptEssentialCookies);
document.getElementById('manage-cookies').addEventListener('click', showCookieNotice);
const cookieChoiceSaved = localStorage.getItem('revise-rise-consent') === 'essential' || document.cookie.split(';').some((cookie) => cookie.trim() === 'revise-rise-consent=essential');
if (!cookieChoiceSaved) document.getElementById('cookie-notice').hidden = false;
