# Chapter 7: Design and Implementation

***

# Executive Summary
[cite_start]Chapter 7 bridges the gap between requirements engineering and the actual coding of the software[cite: 2170, 2173]. It focuses on the transition from conceptual requirements to an executable system. [cite_start]The chapter emphasizes **object-oriented design** using the Unified Modeling Language (UML), the utilization of **design patterns** to solve recurring problems, and critical implementation issues that software engineers must manage, such as **software reuse, configuration management, and open-source development**[cite: 2164, 2168]. 

***

## 1. Introduction to Design and Implementation
[cite_start]Software **design** is a creative process where you identify software components and their relationships based on a customer’s requirements[cite: 2173]. [cite_start]**Implementation** is the process of realizing this design as an executable program[cite: 2174]. 

[cite_start]These two activities are inherently linked and invariably interleaved[cite: 2173, 2179]. [cite_start]In agile environments, formal design documentation might be skipped in favor of whiteboard sketches, while plan-driven approaches might mandate detailed UML modeling before any code is written[cite: 2183]. [cite_start]A critical early decision in this phase is the "build vs. buy" dilemma: evaluating whether to build the software from scratch or buy and adapt an off-the-shelf application to save time and money[cite: 2184, 2185].

***

## 2. Object-Oriented Design using the UML
[cite_start]An **object-oriented (OO) system** is composed of interacting objects that maintain their own private, local state and provide operations to manipulate that state[cite: 2199, 2200]. [cite_start]This concept of *encapsulation* ensures that the representation of an object's state cannot be accessed directly from outside the object, meaning modifying one object does not unintentionally break others[cite: 2200, 2204, 2205].

[cite_start]The OO design process generally involves five sequential (but often iterative) steps[cite: 2209, 2210]:

### 2.1 System Context and Interactions
* [cite_start]**The "Why"**: Before designing the internal architecture, you must define the system boundaries to understand what lies outside the system[cite: 2219, 2221]. 
* **The "How"**: 
    * [cite_start]A **System Context Model** is created to illustrate the external entities (other systems, users, hardware) that interact with the software[cite: 2228, 2229]. 
    * [cite_start]A **Use Case Model** is then used to map out *what* interactions occur without detailing *how* they are processed internally[cite: 2222, 2223].

### 2.2 System Architecture
[cite_start]Once the context and external interactions are clear, engineers design the overarching architecture to handle these interactions[cite: 2235, 2238]. [cite_start]This involves identifying the major components that make up the system and organizing them using architectural patterns (like a layered or client-server model)[cite: 2237, 2238].

### 2.3 Object Class Identification
Identifying the core objects is one of the most challenging parts of OO design. [cite_start]Engineers use several analytical techniques to discover them[cite: 2245]:
1.  **Grammatical Analysis:** Parsing natural language requirements. [cite_start]Nouns translate to objects or attributes, while verbs translate to operations or services[cite: 2246].
2.  [cite_start]**Tangible Entities:** Identifying physical things (e.g., an aircraft), roles (e.g., manager), or events (e.g., a request) in the application domain[cite: 2247, 2248].
3.  [cite_start]**Scenario-Based Analysis:** Tracing through specific use cases to see what data and actions are required to fulfill a scenario[cite: 2250, 2251].

> **Mastery Application (Object Identification):** Imagine you are designing software for a wilderness weather station. [cite_start]A grammatical analysis of the requirement *"The system must report weather data"* reveals a `WeatherData` object (from the noun) and a `report()` operation (from the verb)[cite: 2242]. 

### 2.4 Design Models
[cite_start]Models act as the bridge between abstract requirements and concrete implementation[cite: 2265]. [cite_start]In UML, two primary categories of models are used to document a design[cite: 2281, 2283]:
* **Structural (Static) Models:** Define the system's static structure. [cite_start]Examples include **Subsystem Models** (logical groupings of objects) and Class Diagrams showing inheritance and composition[cite: 2281, 2285, 2286].
* [cite_start]**Dynamic Models:** Describe runtime interactions[cite: 2283]. [cite_start]**Sequence Models** chronologically map out the sequence of object interactions for a specific use case [cite: 2287, 2297][cite_start], while **State Machine Models** track how an individual object's state changes in response to specific events[cite: 2289, 2300].

### 2.5 Interface Specification
[cite_start]Interfaces must be unambiguously defined so that individual objects and subsystems can be developed in parallel by different programmers[cite: 2304]. 
* [cite_start]**The Golden Rule:** Interface specifications should *never* expose the internal data representation (attributes)[cite: 2312]. 
* **The "Why":** If data representation is hidden, it can be easily changed (e.g., switching from an array to a linked list) without breaking any external objects that rely on that interface. [cite_start]This leads to inherently more maintainable code[cite: 2313, 2314, 2315].

***

## 3. Design Patterns
[cite_start]A **design pattern** is a stylized, abstract description of accumulated wisdom—a well-tried solution to a common, recurring software design problem[cite: 2318, 2319]. Patterns facilitate high-level "concept reuse." [cite_start]When you try to reuse exact executable code, you are constrained by the original programmer's specific algorithms; patterns allow you to reuse the *idea* but adapt the implementation to your unique system[cite: 2365, 2366, 2369].

### 3.1 Elements of a Design Pattern
[cite_start]As defined by the "Gang of Four" (the pioneers of software design patterns), a pattern includes four essential elements[cite: 2323, 2340]:
1.  [cite_start]**Name:** A meaningful reference to the pattern[cite: 2340].
2.  [cite_start]**Problem Description:** Explains the motivation and situations where the pattern is applicable[cite: 2341, 2348].
3.  [cite_start]**Solution Description:** A template (often graphical) showing the objects, their relationships, and responsibilities[cite: 2342, 2344].
4.  [cite_start]**Consequences:** The trade-offs and results of applying the pattern[cite: 2346].

### 3.2 Mastery Application: The Observer Pattern
* [cite_start]**The Problem:** You need multiple display formats (e.g., a pie chart and a bar graph) for the exact same underlying dataset, and all of them must update instantly when the data changes[cite: 2331, 2333].
* [cite_start]**The Solution:** The **Observer pattern** separates the data (the `Subject`) from its displays (the `Observers`)[cite: 2335]. The `Subject` maintains the state. [cite_start]When the state changes, the `Subject` issues a notification to all attached `Observers`[cite: 2337]. [cite_start]The `Observer` objects then automatically pull the updated data and refresh their specific displays[cite: 2337]. 

***

## 4. Implementation Issues
Once the design is mapped out, programmers write the code. [cite_start]However, modern software engineering requires managing three major non-programming implementation issues[cite: 2382, 2383]:

### 4.1 Software Reuse
Developing software entirely from scratch is expensive and risky. [cite_start]Modern software is heavily constructed by reusing existing components[cite: 2383, 2397].
* [cite_start]**Abstraction Level:** Reusing successful design patterns and architectural styles[cite: 1163, 1164].
* [cite_start]**Object Level:** Directly reusing specific objects/methods from existing libraries (e.g., using a JavaMail library to process emails)[cite: 2390, 2392].
* [cite_start]**Component Level:** Reusing entire frameworks or collections of objects (e.g., a User Interface framework that handles window displays and event handling)[cite: 2393, 2395].
* [cite_start]**The Trade-off:** While reuse saves time, it involves costs: the time spent searching for and evaluating the software, purchasing licenses, adapting it to your needs, and integrating conflicting components[cite: 2399, 2400, 2403, 2404].

### 4.2 Configuration Management
[cite_start]Because software changes continuously during development, change management is essential[cite: 2406]. [cite_start]If a team doesn't track versions, developers will overwrite each other's code[cite: 2408, 2409].
* [cite_start]**Version Management:** Tools that keep track of component versions and coordinate team development to stop code conflicts[cite: 2415, 2417].
* [cite_start]**System Integration:** Tools that help developers define exactly which versions of which components are combined to create a specific system release[cite: 2418]. 

### 4.3 Host-Target Development
[cite_start]Software is rarely executed on the same machine it was coded on[cite: 2387, 2388]. 
* [cite_start]**The Host:** The development platform where the code is written (using an Integrated Development Environment or IDE)[cite: 2388].
* [cite_start]**The Target:** The execution platform where the software will live[cite: 2388]. [cite_start]Developers must consider the target's specific hardware constraints, physical size, and operating system during implementation[cite: 1068].

***

## 5. Open-Source Development
[cite_start]Open-source development involves publishing the source code of a system and inviting a vast community of volunteers to participate in its development and improvement[cite: 984, 987]. 

### 5.1 Business and Practical Considerations
[cite_start]Making software open-source can reassure customers; if the original company goes out of business, the users know they will still have access to the code and can maintain it themselves[cite: 1040, 1046]. [cite_start]However, open-sourcing a highly specialized application does not guarantee a flood of volunteer developers—most highly successful open-source projects are broad, foundational platform products[cite: 1041, 1042].

### 5.2 Open-Source Licensing Models
[cite_start]While the code is freely available, the developer still legally owns the code and uses licenses to dictate exactly how it can be reused[cite: 1047, 1048, 1049]:
1.  **GNU General Public License (GPL):** A "reciprocal" license. [cite_start]If you embed GPL-licensed code in your system, your entire system *must* also be made open-source[cite: 1053, 1054].
2.  **GNU Lesser General Public License (LGPL):** A variant where you can link to LGPL code without open-sourcing your entire system. [cite_start]However, if you modify the LGPL component itself, those specific modifications must be published[cite: 1073, 1074].
3.  **Berkley Standard Distribution (BSD) / MIT:** Non-reciprocal licenses. [cite_start]You can use the code in proprietary, closed-source commercial systems that you sell, as long as you acknowledge the original creator of the code[cite: 1075, 1077, 1078].