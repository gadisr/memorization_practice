--
-- PostgreSQL database dump
--

\restrict KxTbJGNkgsishIdNKo38DWhchp7MnSvAmj5Rxej3hLl4CedfkLfzYduNeIgcdqG

-- Dumped from database version 15.14
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: notation_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notation_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_date timestamp with time zone NOT NULL,
    drill_type character varying(50) NOT NULL,
    attempts jsonb NOT NULL,
    total_pieces integer NOT NULL,
    correct_count integer NOT NULL,
    accuracy numeric(5,2) NOT NULL,
    average_time numeric(10,3) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    total_time numeric(10,3)
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_date timestamp with time zone NOT NULL,
    drill_type character varying(50) NOT NULL,
    pair_count integer NOT NULL,
    pairs jsonb NOT NULL,
    timings jsonb NOT NULL,
    average_time numeric(10,3) NOT NULL,
    recall_accuracy numeric(5,2) NOT NULL,
    vividness integer,
    flow integer,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    total_time numeric(10,3),
    user_recall text,
    recall_validation jsonb
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    firebase_uid character varying(128) NOT NULL,
    email character varying(255) NOT NULL,
    display_name character varying(255),
    profile_picture_url character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    last_login timestamp with time zone,
    is_active boolean DEFAULT true
);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alembic_version (version_num) FROM stdin;
004
\.


--
-- Data for Name: notation_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notation_sessions (id, user_id, session_date, drill_type, attempts, total_pieces, correct_count, accuracy, average_time, notes, created_at, total_time) FROM stdin;
ec0d8006-44fd-456a-b6e2-5b8ab88a46f9	85534919-cb8e-4e67-b008-c81078930053	2025-10-16 21:16:20.371+00	EDGE_NOTATION_DRILL	[{"isCorrect": true, "userAnswer": "b", "pieceColors": ["white", "red"], "timeSeconds": 5.82, "correctAnswer": "B"}, {"isCorrect": true, "userAnswer": "t", "pieceColors": ["blue", "red"], "timeSeconds": 5.07, "correctAnswer": "T"}, {"isCorrect": true, "userAnswer": "h", "pieceColors": ["orange", "blue"], "timeSeconds": 3.58, "correctAnswer": "H"}, {"isCorrect": true, "userAnswer": "q", "pieceColors": ["blue", "white"], "timeSeconds": 2.76, "correctAnswer": "Q"}, {"isCorrect": true, "userAnswer": "a", "pieceColors": ["white", "blue"], "timeSeconds": 2.42, "correctAnswer": "A"}, {"isCorrect": true, "userAnswer": "c", "pieceColors": ["white", "green"], "timeSeconds": 2.2, "correctAnswer": "C"}, {"isCorrect": true, "userAnswer": "d", "pieceColors": ["white", "orange"], "timeSeconds": 2.38, "correctAnswer": "D"}, {"isCorrect": true, "userAnswer": "u", "pieceColors": ["yellow", "green"], "timeSeconds": 3.23, "correctAnswer": "U"}, {"isCorrect": true, "userAnswer": "i", "pieceColors": ["green", "white"], "timeSeconds": 2.83, "correctAnswer": "I"}, {"isCorrect": true, "userAnswer": "p", "pieceColors": ["red", "green"], "timeSeconds": 3.76, "correctAnswer": "P"}, {"isCorrect": true, "userAnswer": "m", "pieceColors": ["red", "white"], "timeSeconds": 4.9, "correctAnswer": "M"}, {"isCorrect": true, "userAnswer": "j", "pieceColors": ["green", "red"], "timeSeconds": 4.57, "correctAnswer": "J"}, {"isCorrect": true, "userAnswer": "s", "pieceColors": ["blue", "yellow"], "timeSeconds": 6.19, "correctAnswer": "S"}, {"isCorrect": true, "userAnswer": "l", "pieceColors": ["green", "orange"], "timeSeconds": 5.77, "correctAnswer": "L"}, {"isCorrect": true, "userAnswer": "n", "pieceColors": ["red", "blue"], "timeSeconds": 4.39, "correctAnswer": "N"}, {"isCorrect": true, "userAnswer": "o", "pieceColors": ["red", "yellow"], "timeSeconds": 3.16, "correctAnswer": "O"}, {"isCorrect": true, "userAnswer": "g", "pieceColors": ["orange", "yellow"], "timeSeconds": 3.84, "correctAnswer": "G"}, {"isCorrect": true, "userAnswer": "f", "pieceColors": ["orange", "green"], "timeSeconds": 3.01, "correctAnswer": "F"}, {"isCorrect": true, "userAnswer": "w", "pieceColors": ["yellow", "blue"], "timeSeconds": 4.88, "correctAnswer": "W"}, {"isCorrect": true, "userAnswer": "x", "pieceColors": ["yellow", "orange"], "timeSeconds": 5.54, "correctAnswer": "X"}, {"isCorrect": true, "userAnswer": "k", "pieceColors": ["green", "yellow"], "timeSeconds": 5.91, "correctAnswer": "K"}, {"isCorrect": true, "userAnswer": "e", "pieceColors": ["orange", "white"], "timeSeconds": 3.86, "correctAnswer": "E"}, {"isCorrect": true, "userAnswer": "v", "pieceColors": ["yellow", "red"], "timeSeconds": 3.91, "correctAnswer": "V"}, {"isCorrect": true, "userAnswer": "r", "pieceColors": ["blue", "orange"], "timeSeconds": 6.97, "correctAnswer": "R"}]	24	24	100.00	4.206	\N	2025-10-16 21:18:32.757033+00	\N
e7ff2d81-b576-4843-9702-9e9e7f0d6901	85534919-cb8e-4e67-b008-c81078930053	2025-10-17 05:36:11.472+00	CORNER_NOTATION_DRILL	[{"isCorrect": true, "userAnswer": "L", "pieceColors": ["green", "yellow", "orange"], "timeSeconds": 9.32, "correctAnswer": "L"}, {"isCorrect": true, "userAnswer": "C", "pieceColors": ["white", "red", "green"], "timeSeconds": 6.47, "correctAnswer": "C"}, {"isCorrect": true, "userAnswer": "P", "pieceColors": ["red", "yellow", "green"], "timeSeconds": 5.58, "correctAnswer": "P"}, {"isCorrect": true, "userAnswer": "M", "pieceColors": ["red", "green", "white"], "timeSeconds": 8.56, "correctAnswer": "M"}, {"isCorrect": true, "userAnswer": "W", "pieceColors": ["yellow", "red", "blue"], "timeSeconds": 10.15, "correctAnswer": "W"}, {"isCorrect": true, "userAnswer": "J", "pieceColors": ["green", "white", "red"], "timeSeconds": 6.51, "correctAnswer": "J"}, {"isCorrect": true, "userAnswer": "R", "pieceColors": ["blue", "white", "orange"], "timeSeconds": 8.23, "correctAnswer": "R"}, {"isCorrect": true, "userAnswer": "T", "pieceColors": ["blue", "yellow", "red"], "timeSeconds": 6.31, "correctAnswer": "T"}, {"isCorrect": true, "userAnswer": "A", "pieceColors": ["white", "orange", "blue"], "timeSeconds": 6.86, "correctAnswer": "A"}, {"isCorrect": true, "userAnswer": "S", "pieceColors": ["blue", "orange", "yellow"], "timeSeconds": 8.8, "correctAnswer": "S"}, {"isCorrect": true, "userAnswer": "F", "pieceColors": ["orange", "white", "green"], "timeSeconds": 5.33, "correctAnswer": "F"}, {"isCorrect": true, "userAnswer": "H", "pieceColors": ["orange", "yellow", "blue"], "timeSeconds": 5.26, "correctAnswer": "H"}, {"isCorrect": true, "userAnswer": "B", "pieceColors": ["white", "blue", "red"], "timeSeconds": 4.81, "correctAnswer": "B"}, {"isCorrect": true, "userAnswer": "U", "pieceColors": ["yellow", "orange", "green"], "timeSeconds": 6.13, "correctAnswer": "U"}, {"isCorrect": true, "userAnswer": "V", "pieceColors": ["yellow", "green", "red"], "timeSeconds": 3.2, "correctAnswer": "V"}, {"isCorrect": false, "userAnswer": "J", "pieceColors": ["green", "orange", "white"], "timeSeconds": 9.35, "correctAnswer": "I"}, {"isCorrect": false, "userAnswer": "I", "pieceColors": ["green", "red", "yellow"], "timeSeconds": 9.37, "correctAnswer": "K"}, {"isCorrect": true, "userAnswer": "O", "pieceColors": ["red", "blue", "yellow"], "timeSeconds": 8.65, "correctAnswer": "O"}, {"isCorrect": true, "userAnswer": "G", "pieceColors": ["orange", "green", "yellow"], "timeSeconds": 4.9, "correctAnswer": "G"}, {"isCorrect": true, "userAnswer": "D", "pieceColors": ["white", "green", "orange"], "timeSeconds": 4.15, "correctAnswer": "D"}, {"isCorrect": true, "userAnswer": "E", "pieceColors": ["orange", "blue", "white"], "timeSeconds": 5.47, "correctAnswer": "E"}, {"isCorrect": true, "userAnswer": "Q", "pieceColors": ["blue", "red", "white"], "timeSeconds": 5.7, "correctAnswer": "Q"}, {"isCorrect": true, "userAnswer": "X", "pieceColors": ["yellow", "blue", "orange"], "timeSeconds": 7.28, "correctAnswer": "X"}, {"isCorrect": true, "userAnswer": "N", "pieceColors": ["red", "white", "blue"], "timeSeconds": 6.31, "correctAnswer": "N"}]	24	22	91.67	6.779	\N	2025-10-17 05:39:30.980364+00	\N
133ecd04-5ce4-481e-9f91-e7f6a52e6756	85534919-cb8e-4e67-b008-c81078930053	2025-10-21 14:44:00.654+00	EDGE_NOTATION_DRILL	[{"isCorrect": true, "userAnswer": "v", "pieceColors": ["yellow", "red"], "timeSeconds": 4.67, "correctAnswer": "v"}, {"isCorrect": true, "userAnswer": "u", "pieceColors": ["yellow", "green"], "timeSeconds": 3.86, "correctAnswer": "u"}, {"isCorrect": true, "userAnswer": "s", "pieceColors": ["blue", "yellow"], "timeSeconds": 4.75, "correctAnswer": "s"}, {"isCorrect": true, "userAnswer": "c", "pieceColors": ["white", "green"], "timeSeconds": 3.52, "correctAnswer": "c"}, {"isCorrect": true, "userAnswer": "e", "pieceColors": ["orange", "white"], "timeSeconds": 2.48, "correctAnswer": "e"}, {"isCorrect": true, "userAnswer": "n", "pieceColors": ["red", "blue"], "timeSeconds": 5.92, "correctAnswer": "n"}, {"isCorrect": false, "userAnswer": "g", "pieceColors": ["orange", "blue"], "timeSeconds": 3.91, "correctAnswer": "h"}, {"isCorrect": true, "userAnswer": "j", "pieceColors": ["green", "red"], "timeSeconds": 5.52, "correctAnswer": "j"}, {"isCorrect": true, "userAnswer": "p", "pieceColors": ["red", "green"], "timeSeconds": 2.87, "correctAnswer": "p"}, {"isCorrect": true, "userAnswer": "f", "pieceColors": ["orange", "green"], "timeSeconds": 4.48, "correctAnswer": "f"}, {"isCorrect": true, "userAnswer": "q", "pieceColors": ["blue", "white"], "timeSeconds": 1.92, "correctAnswer": "q"}, {"isCorrect": true, "userAnswer": "i", "pieceColors": ["green", "white"], "timeSeconds": 2.6, "correctAnswer": "i"}, {"isCorrect": true, "userAnswer": "m", "pieceColors": ["red", "white"], "timeSeconds": 3.91, "correctAnswer": "m"}, {"isCorrect": true, "userAnswer": "x", "pieceColors": ["yellow", "orange"], "timeSeconds": 4.39, "correctAnswer": "x"}, {"isCorrect": true, "userAnswer": "o", "pieceColors": ["red", "yellow"], "timeSeconds": 5.26, "correctAnswer": "o"}, {"isCorrect": true, "userAnswer": "k", "pieceColors": ["green", "yellow"], "timeSeconds": 4.5, "correctAnswer": "k"}, {"isCorrect": true, "userAnswer": "g", "pieceColors": ["orange", "yellow"], "timeSeconds": 6.24, "correctAnswer": "g"}, {"isCorrect": true, "userAnswer": "b", "pieceColors": ["white", "red"], "timeSeconds": 2.7, "correctAnswer": "b"}, {"isCorrect": true, "userAnswer": "t", "pieceColors": ["blue", "red"], "timeSeconds": 4.54, "correctAnswer": "t"}, {"isCorrect": true, "userAnswer": "r", "pieceColors": ["blue", "orange"], "timeSeconds": 2.36, "correctAnswer": "r"}, {"isCorrect": true, "userAnswer": "w", "pieceColors": ["yellow", "blue"], "timeSeconds": 3.51, "correctAnswer": "w"}, {"isCorrect": true, "userAnswer": "a", "pieceColors": ["white", "blue"], "timeSeconds": 2.7, "correctAnswer": "a"}, {"isCorrect": true, "userAnswer": "d", "pieceColors": ["white", "orange"], "timeSeconds": 2.29, "correctAnswer": "d"}, {"isCorrect": true, "userAnswer": "l", "pieceColors": ["green", "orange"], "timeSeconds": 4.66, "correctAnswer": "l"}]	24	23	95.83	3.898	\N	2025-10-21 14:46:04.882752+00	124.125
c7d03a52-ed96-4722-bd01-5e28f81ba0fd	85534919-cb8e-4e67-b008-c81078930053	2025-10-21 14:46:28.562+00	CORNER_NOTATION_DRILL	[{"isCorrect": true, "userAnswer": "l", "pieceColors": ["green", "yellow", "orange"], "timeSeconds": 9.48, "correctAnswer": "L"}, {"isCorrect": true, "userAnswer": "j", "pieceColors": ["green", "white", "red"], "timeSeconds": 7.55, "correctAnswer": "J"}, {"isCorrect": true, "userAnswer": "a", "pieceColors": ["white", "orange", "blue"], "timeSeconds": 2.93, "correctAnswer": "A"}, {"isCorrect": true, "userAnswer": "g", "pieceColors": ["orange", "green", "yellow"], "timeSeconds": 6.54, "correctAnswer": "G"}, {"isCorrect": true, "userAnswer": "w", "pieceColors": ["yellow", "red", "blue"], "timeSeconds": 8.7, "correctAnswer": "W"}, {"isCorrect": true, "userAnswer": "p", "pieceColors": ["red", "yellow", "green"], "timeSeconds": 7, "correctAnswer": "P"}, {"isCorrect": true, "userAnswer": "t", "pieceColors": ["blue", "yellow", "red"], "timeSeconds": 10.39, "correctAnswer": "T"}, {"isCorrect": true, "userAnswer": "o", "pieceColors": ["red", "blue", "yellow"], "timeSeconds": 4.96, "correctAnswer": "O"}, {"isCorrect": true, "userAnswer": "r", "pieceColors": ["blue", "white", "orange"], "timeSeconds": 6.05, "correctAnswer": "R"}, {"isCorrect": true, "userAnswer": "x", "pieceColors": ["yellow", "blue", "orange"], "timeSeconds": 9.83, "correctAnswer": "X"}, {"isCorrect": false, "userAnswer": "w", "pieceColors": ["yellow", "green", "red"], "timeSeconds": 7.79, "correctAnswer": "V"}, {"isCorrect": true, "userAnswer": "d", "pieceColors": ["white", "green", "orange"], "timeSeconds": 6.22, "correctAnswer": "D"}, {"isCorrect": true, "userAnswer": "e", "pieceColors": ["orange", "blue", "white"], "timeSeconds": 5.13, "correctAnswer": "E"}, {"isCorrect": true, "userAnswer": "b", "pieceColors": ["white", "blue", "red"], "timeSeconds": 5.33, "correctAnswer": "B"}, {"isCorrect": true, "userAnswer": "s", "pieceColors": ["blue", "orange", "yellow"], "timeSeconds": 5.6, "correctAnswer": "S"}, {"isCorrect": true, "userAnswer": "i", "pieceColors": ["green", "orange", "white"], "timeSeconds": 5.99, "correctAnswer": "I"}, {"isCorrect": true, "userAnswer": "q", "pieceColors": ["blue", "red", "white"], "timeSeconds": 5.21, "correctAnswer": "Q"}, {"isCorrect": true, "userAnswer": "m", "pieceColors": ["red", "green", "white"], "timeSeconds": 3.99, "correctAnswer": "M"}, {"isCorrect": true, "userAnswer": "c", "pieceColors": ["white", "red", "green"], "timeSeconds": 5.78, "correctAnswer": "C"}, {"isCorrect": true, "userAnswer": "f", "pieceColors": ["orange", "white", "green"], "timeSeconds": 6.46, "correctAnswer": "F"}, {"isCorrect": true, "userAnswer": "u", "pieceColors": ["yellow", "orange", "green"], "timeSeconds": 3.69, "correctAnswer": "U"}, {"isCorrect": true, "userAnswer": "n", "pieceColors": ["red", "white", "blue"], "timeSeconds": 4.84, "correctAnswer": "N"}, {"isCorrect": true, "userAnswer": "h", "pieceColors": ["orange", "yellow", "blue"], "timeSeconds": 6.7, "correctAnswer": "H"}, {"isCorrect": true, "userAnswer": "k", "pieceColors": ["green", "red", "yellow"], "timeSeconds": 6.18, "correctAnswer": "K"}]	24	23	95.83	6.347	\N	2025-10-21 14:49:30.723756+00	182.089
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, session_date, drill_type, pair_count, pairs, timings, average_time, recall_accuracy, vividness, flow, notes, created_at, total_time, user_recall, recall_validation) FROM stdin;
6d87fcb6-60ec-4d18-a6c3-293cfd57363c	85534919-cb8e-4e67-b008-c81078930053	2025-10-17 05:46:35.696+00	FLASH_PAIRS	30	[{"pair": "KD", "timestamp": 1760679995696, "displayOrder": 0}, {"pair": "OX", "timestamp": 1760679995696, "displayOrder": 1}, {"pair": "XT", "timestamp": 1760679995696, "displayOrder": 2}, {"pair": "PL", "timestamp": 1760679995696, "displayOrder": 3}, {"pair": "HY", "timestamp": 1760679995696, "displayOrder": 4}, {"pair": "RO", "timestamp": 1760679995696, "displayOrder": 5}, {"pair": "VN", "timestamp": 1760679995696, "displayOrder": 6}, {"pair": "RE", "timestamp": 1760679995696, "displayOrder": 7}, {"pair": "PK", "timestamp": 1760679995696, "displayOrder": 8}, {"pair": "JG", "timestamp": 1760679995696, "displayOrder": 9}, {"pair": "DE", "timestamp": 1760679995696, "displayOrder": 10}, {"pair": "YP", "timestamp": 1760679995696, "displayOrder": 11}, {"pair": "YQ", "timestamp": 1760679995696, "displayOrder": 12}, {"pair": "BB", "timestamp": 1760679995696, "displayOrder": 13}, {"pair": "AZ", "timestamp": 1760679995696, "displayOrder": 14}, {"pair": "YB", "timestamp": 1760679995696, "displayOrder": 15}, {"pair": "WB", "timestamp": 1760679995696, "displayOrder": 16}, {"pair": "ZX", "timestamp": 1760679995696, "displayOrder": 17}, {"pair": "TU", "timestamp": 1760679995696, "displayOrder": 18}, {"pair": "IA", "timestamp": 1760679995696, "displayOrder": 19}, {"pair": "JL", "timestamp": 1760679995696, "displayOrder": 20}, {"pair": "NN", "timestamp": 1760679995696, "displayOrder": 21}, {"pair": "IL", "timestamp": 1760679995696, "displayOrder": 22}, {"pair": "KG", "timestamp": 1760679995696, "displayOrder": 23}, {"pair": "XI", "timestamp": 1760679995696, "displayOrder": 24}, {"pair": "RR", "timestamp": 1760679995696, "displayOrder": 25}, {"pair": "PX", "timestamp": 1760679995696, "displayOrder": 26}, {"pair": "KM", "timestamp": 1760679995696, "displayOrder": 27}, {"pair": "GW", "timestamp": 1760679995696, "displayOrder": 28}, {"pair": "UZ", "timestamp": 1760679995696, "displayOrder": 29}]	[5.78, 4.85, 8.92, 6.55, 6.35, 4.33, 8.78, 4.4, 4.56, 4.11, 5.03, 7.92, 4.73, 8.79, 4.16, 6.88, 5.03, 6.94, 6.11, 6.23, 6.74, 73.48, 5.28, 3.41, 3.25, 7.32, 5.81, 5.21, 5.22, 6.12]	8.080	30.00	3	\N	\N	2025-10-17 05:52:00.132753+00	\N	\N	\N
36d6bd4e-6134-40a7-9069-561979b74a74	85534919-cb8e-4e67-b008-c81078930053	2025-10-17 06:12:43.548+00	TWO_PAIR_FUSION	5	[{"pair": "DQ", "timestamp": 1760681563548, "displayOrder": 0}, {"pair": "NS", "timestamp": 1760681563548, "displayOrder": 1}, {"pair": "UL", "timestamp": 1760681563548, "displayOrder": 2}, {"pair": "UE", "timestamp": 1760681563548, "displayOrder": 3}, {"pair": "SP", "timestamp": 1760681563548, "displayOrder": 4}]	[12.38, 13.26, 19.94, 17.33, 27.17]	18.020	100.00	3	\N	\N	2025-10-17 06:14:52.484101+00	128.081	DQ NS UL UE SP	{"accuracy": 100, "extraPairs": [], "missedPairs": [], "correctPairs": ["DQ", "NS", "UL", "UE", "SP"], "incorrectPairs": [], "isOrderRequired": true}
9baa7ca5-98e0-4ef2-afce-8620b85ef5a6	85534919-cb8e-4e67-b008-c81078930053	2025-10-21 14:50:19.185+00	FLASH_PAIRS	30	[{"pair": "CB", "timestamp": 1761058219185, "displayOrder": 0}, {"pair": "HS", "timestamp": 1761058219185, "displayOrder": 1}, {"pair": "PK", "timestamp": 1761058219185, "displayOrder": 2}, {"pair": "NG", "timestamp": 1761058219185, "displayOrder": 3}, {"pair": "ZR", "timestamp": 1761058219185, "displayOrder": 4}, {"pair": "GO", "timestamp": 1761058219185, "displayOrder": 5}, {"pair": "QI", "timestamp": 1761058219185, "displayOrder": 6}, {"pair": "ZX", "timestamp": 1761058219185, "displayOrder": 7}, {"pair": "HQ", "timestamp": 1761058219185, "displayOrder": 8}, {"pair": "QQ", "timestamp": 1761058219185, "displayOrder": 9}, {"pair": "TR", "timestamp": 1761058219185, "displayOrder": 10}, {"pair": "IA", "timestamp": 1761058219185, "displayOrder": 11}, {"pair": "FO", "timestamp": 1761058219185, "displayOrder": 12}, {"pair": "RR", "timestamp": 1761058219185, "displayOrder": 13}, {"pair": "UC", "timestamp": 1761058219185, "displayOrder": 14}, {"pair": "FV", "timestamp": 1761058219185, "displayOrder": 15}, {"pair": "BQ", "timestamp": 1761058219185, "displayOrder": 16}, {"pair": "YL", "timestamp": 1761058219185, "displayOrder": 17}, {"pair": "MU", "timestamp": 1761058219185, "displayOrder": 18}, {"pair": "OC", "timestamp": 1761058219185, "displayOrder": 19}, {"pair": "RM", "timestamp": 1761058219185, "displayOrder": 20}, {"pair": "JM", "timestamp": 1761058219185, "displayOrder": 21}, {"pair": "YA", "timestamp": 1761058219185, "displayOrder": 22}, {"pair": "BP", "timestamp": 1761058219185, "displayOrder": 23}, {"pair": "JL", "timestamp": 1761058219185, "displayOrder": 24}, {"pair": "RS", "timestamp": 1761058219185, "displayOrder": 25}, {"pair": "GA", "timestamp": 1761058219185, "displayOrder": 26}, {"pair": "SZ", "timestamp": 1761058219185, "displayOrder": 27}, {"pair": "DS", "timestamp": 1761058219185, "displayOrder": 28}, {"pair": "LB", "timestamp": 1761058219185, "displayOrder": 29}]	[4.17, 5.12, 4.24, 4.19, 6.42, 5.08, 5.03, 6.52, 7.5, 3.2, 6.97, 5.57, 6.88, 7.28, 7.46, 5.84, 6.33, 11.21, 9.91, 4.38, 8.78, 4.96, 5.32, 36.49, 11.1, 5.44, 5.33, 6.35, 6.92, 8.67]	7.420	13.33	2	\N	\N	2025-10-21 14:54:57.599168+00	278.337	LB SZ QQ HS Lo	{"accuracy": 13.333333333333334, "extraPairs": ["LO"], "missedPairs": ["BC", "KP", "GN", "RZ", "GO", "IQ", "XZ", "HQ", "RT", "AI", "FO", "RR", "CU", "FV", "BQ", "LY", "MU", "CO", "MR", "JM", "AY", "BP", "JL", "RS", "AG", "DS"], "correctPairs": ["HS", "QQ", "SZ", "BL"], "incorrectPairs": [], "isOrderRequired": false}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, firebase_uid, email, display_name, profile_picture_url, created_at, updated_at, last_login, is_active) FROM stdin;
85534919-cb8e-4e67-b008-c81078930053	nILp3hL4SNhtl13NECNvWYNkei43	gadi.sr@gmail.com	Gadi Srebnik	https://lh3.googleusercontent.com/a/ACg8ocIcYCXEHaofG7mHt3F0I5ZZgjqKx3eIqNOCT-efHNcK287qMgqg5w=s96-c	2025-10-16 21:13:56.99241+00	2025-10-21 19:17:46.789605+00	2025-10-21 19:17:46.790736+00	t
\.


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: notation_sessions notation_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notation_sessions
    ADD CONSTRAINT notation_sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_notation_sessions_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notation_sessions_date ON public.notation_sessions USING btree (session_date DESC);


--
-- Name: idx_notation_sessions_drill_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notation_sessions_drill_type ON public.notation_sessions USING btree (drill_type);


--
-- Name: idx_notation_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notation_sessions_user_id ON public.notation_sessions USING btree (user_id);


--
-- Name: idx_sessions_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_date ON public.sessions USING btree (session_date DESC);


--
-- Name: idx_sessions_drill_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_drill_type ON public.sessions USING btree (drill_type);


--
-- Name: idx_sessions_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_date ON public.sessions USING btree (user_id, session_date DESC);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_firebase_uid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_users_firebase_uid ON public.users USING btree (firebase_uid);


--
-- Name: notation_sessions notation_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notation_sessions
    ADD CONSTRAINT notation_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict KxTbJGNkgsishIdNKo38DWhchp7MnSvAmj5Rxej3hLl4CedfkLfzYduNeIgcdqG

