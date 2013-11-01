==============================================================
Engineering Calculators Written In Javascript
==============================================================

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.cladlab.com)
- Created: 2013/06/06
- Last Modified: 2013/11/01
- Version: v3.0.0.0
- Company: CladLabs
- Project: Free Code Libraries	.
- Language: HTML/JS/PHP
- Compiler: n/a
- uC Model: n/a
- Computer Architecture: n/a
- Operating System: n/a
- Documentation Format: Doxygen
- License: GPLv3

Description
===========

Contains engineering calculators designed to be viewed with a browser.

Heat Flow Calculator
--------------------

Calculates power dissipation, thermal resistance, or temperature change, given the other two parameters. You can dynamically add more thermal components (having both a thermal resistance and temperature change) to the equation.

Standard Resistance Calculator
------------------------------

Given an input resistance, finds the closest resistance in a specified standard resistance series (an E series, e.g. E12 or E24).

LT3745 Calculator
-----------------

Calculates values of the supporting passive components for the LT3745 LED driver by Linear Technology. Uses equations given in the datasheet.

Internal Dependencies
=====================

None.

External Dependencies
=====================

MathJax (delivered through MathJax CDN) for latex rendering of equations.

knockout.js (delivered through CDN) for MVVM framework.

Issues
======

See GitHub Issues.

Limitations
===========

None documented.

Usage
=====

Load .php files in browser.
	
Changelog
=========

========= ========== ============================================================================================================
Version   Date       Comment
========= ========== ============================================================================================================
v3.0.0.0  2013/11/01 Added calculator for LT3745 LED driver under chip-specific/lt3745. Calculates values for supporting passive components, based on equations given in the datasheet. Added relevant info to the datasheet.
v2.2.11.1 2013/10/07 Fixed restructured text table in README so that it displays correctly.
v2.2.11.0 2013/10/07 Set the debug flag to false.
v2.2.10.0 2013/10/07 Changes jQuery inclusion code again in attempt to fix conflict bug. This time uses window.onload().
v2.2.9.0  2013/10/07 Changed conditional jQuery inclusion code in attempt to fix conflict bug.
v2.2.8.0  2013/10/07 Added check for jQuery before it is loaded, to prevent it being loaded twice and causing conflicts.
v2.2.7.0  2013/10/07 Fixed NaN bug when desired resistance was above highest number in series, by adding the first number in the next order of magnitude to the end of the series arrays. Re-included jQuery, as I discovered it is needed for these scripts.
v2.2.6.0  2013/10/07 Removed jQuery include in standard resistance calculator, as not needed, and was causing issues with the Wordpress MegaMenu.
v2.2.5.2  2013/10/07 Added title block to php files. Added comments to php files.
v2.2.5.1  2013/10/07 Changed incorrect standard-resistance-calculator.c extension in title block to .js.
v2.2.5.0  2013/10/07 Set debug to false in the standard resistance calculator Javascript file.
v2.2.4.0  2013/10/07 Added backslashes to the start/end in the preg pattern, also escaped a forward slash. 
v2.2.3.0  2013/10/07 Formatted __FILE__ so remove leading public_html (and beforehand) parts to URL. 
v2.2.2.0  2013/10/07 Made standard resistor php file load JS script with realpath(dirname(__FILE__)), which should give the correct path no matter where php file is included from.
v2.2.1.0  2013/10/07 Removed defer keyword from Javascript file include in standard resistance calculator. Moved this include to below HTML code.
v2.2.0.1  2013/09/27 Added knockout.js to list of external dependencies in README.
v2.2.0.0  2013/09/27 Rewrote the standard resistance finder calculator to use the knockout.js MVVM framework.
v2.1.2.0  2013/09/26 Renamed another index.php to heat-flow.php.
v2.1.1.0  2013/09/26 Renamed index.php to standard-resistance-finder.php. Added info about the standard resistance calculator to README.
v2.1.0.0  2013/09/17 Standard resistance calculator now works for finding E12, E24, E48, E96 and E192 values. Reports closest match and percentage error.
v2.0.0.0  2013/09/16 Added standard resistance calculator. Just started working on it's code, got a table looking half-decent. All the JS code from the heat flow calculator present in file, using as a template.
v1.1.0.0  2013/06/12 Release version. Heat flow table working! Using MathJax to render latex client-side. Added image to folder. 
v1.0.7.0  2013/06/11	Heat flow table almost working, except value calc bug when adding then removing rows.
v1.0.6.0  2013/06/11	Heat flow table calculating totals correctly for all three variables.
v1.0.5.0  2013/06/10 Heat flow table adding TOTAL row with 2 or more thermal components.
v1.0.4.0  2013/06/09 Heat flow table copying row correctly using insertBefore().
v1.0.3.0  2013/06/09 Heat flow table meant to be adding copied row into middle of table, but throwing DOM exception.
v1.0.2.0  2013/06/08 Re-arranged table so adding new rows makes more sense. Fixed version number.
v1.0.1.1  2013/06/08 Changelog now in table format.
v1.0.1.0  2013/06/08 Heat flow calc can now add more rows.
v1.0.0.1  2013/06/06 Fixed two README section titles from having all capitals.
v1.0.0.0  2013/06/06 Initial commit.
========= ========== ============================================================================================================